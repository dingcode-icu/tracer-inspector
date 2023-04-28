import fetch from 'node-fetch';
import { getOctokit, context } from '@actions/github';
import fs from 'fs';

import updatelog from './updatelog.mjs';

const token = process.env.GITHUB_TOKEN;

async function updater() {
  if (!token) {
    console.log('GITHUB_TOKEN is required');
    process.exit(1);
  }

  // 用户名，仓库名
  const options = { owner: context.repo.owner, repo: context.repo.repo };
  const github = getOctokit(token);

  // 获取 tag
  const { data: tags } = await github.rest.repos.listTags({
    ...options,
    per_page: 10,
    page: 1,
  });

  // 过滤包含 `v` 版本信息的 tag
  const tag = tags.find((t) => t.name.startsWith('v'));
  // console.log(`${JSON.stringify(tag, null, 2)}`);

  if (!tag) return;

  // 获取此 tag 的详细信息
  const { data: latestRelease } = await github.rest.repos.getReleaseByTag({
    ...options,
    tag: tag.name,
  });

  // 需要生成的静态 json 文件数据，根据自己的需要进行调整
  const updateData = {
    version: tag.name,
    // 使用 UPDATE_LOG.md，如果不需要版本更新日志，则将此字段置空
    notes: updatelog(tag.name),
    pub_date: new Date().toISOString(),
    platforms: {
      win64: { signature: '', url: '' }, // compatible with older formats
      linux: { signature: '', url: '' }, // compatible with older formats
      darwin: { signature: '', url: '' }, // compatible with older formats
      'darwin-aarch64': { signature: '', url: '' },
      'darwin-x86_64': { signature: '', url: '' },
      'linux-x86_64': { signature: '', url: '' },
      'windows-x86_64': { signature: '', url: '' },
      // 'windows-i686': { signature: '', url: '' }, // no supported
    },
  };

  const setAsset = async (asset, reg, platforms, sign) => {
    console.log(sign, "--->>sign")
    platforms.forEach((platform) => {
      if (reg.test(asset.name)) {
        // 设置下载链接
        updateData.platforms[platform].url = asset.browser_download_url;
        updateData.platforms[platform].signature = sign
      }
    });
  };

  const signer_from_asset = {
    exe:"exe-sign", 
    dmg: "dmg-sign"
  }
  const pp = latestRelease.assets.map(async (asset) => {
    if (/.sig/.test(asset.name)) {
      if (/.app.tar.gz.sig/.test(asset.name)){
        signer_from_asset.dmg = await getSignature(asset.browser_download_url);
      }
      else if (/.msi.zip.sig/.test(asset.name)){
        signer_from_asset.exe = await getSignature(asset.browser_download_url);
      }
    }
  })
  await Promise.allSettled(pp);

  console.log(signer_from_asset, "-->>signer from asset")

  const promises = latestRelease.assets.map(async (asset) => {
    // windows
    await setAsset(asset, /.msi.zip/, ['win64', 'windows-x86_64'], signer_from_asset.exe);

    // darwin
    await setAsset(asset, /.app.tar.gz/, [
      'darwin',
      'darwin-x86_64',
      'darwin-aarch64',
    ], signer_from_asset.dmg);

    // linux
    await setAsset(asset, /.AppImage.tar.gz/, ['linux', 'linux-x86_64'], "NOT-BUIDLD-TARGET");
  });
  await Promise.allSettled(promises);

  if (!fs.existsSync('updater')) {
    fs.mkdirSync('updater');
  }

  // 将数据写入文件
  fs.writeFileSync(
    './updater/install.json',
    JSON.stringify(updateData, null, 2)
  );
  console.log('Generate updater/install.json');
}

updater().catch(console.error);

// 获取签名内容
async function getSignature(url) {
  console.log("find sign url is -->>", url)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/octet-stream' },
    });
    let sign = await response.text()
    console.log("sign url is :", url, "  resp:", sign)
    return sign;
  } catch (err) {
    console.log("catch err ", err)
    return '';
  }
}
