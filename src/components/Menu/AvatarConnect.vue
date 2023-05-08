<template>
    <div>
        <el-dialog v-model="isConDialogVisible" title="Connect" width="400px" align-center :close-on-click-modal=false
            top="3vh" :show-close=false>
            <h3>
                Connect host by tag:
            </h3>
            <el-row justify="center">
                <el-select v-model="selConShistory.device_name" :disabled="isSetNewhost" :filterable=true style="width: 400px;">
                    <el-option v-for="item in listConHistory" :key="item.device_name"
                        :label="`${item.device_name}  ${item.host}:${item.port}`" :value="item.host">
                        <span style="float: left">{{ item.device_name }}</span>
                        <span style="float: right;
                                color: var(--el-text-color-secondary);
                                font-size: 13px;
                                    ">
                            {{ `${item.host}:${item.port}` }}
                        </span>
                    </el-option>
                </el-select>
            </el-row>

            <el-divider>
                <el-checkbox v-model="isSetNewhost" label="or set new host" size="large" />
            </el-divider>
            <h3>
                Add new host:
            </h3>
            <el-col justify="start">
                <el-form-item>
                    <el-input v-model="debugHostForm.device_name" style="width: 200px;" :disabled="!isSetNewhost">
                        <template #prepend>Tag</template>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="debugHostForm.host" placeholder="127.0.0.1" style="width: 200px;"
                        :disabled="!isSetNewhost">
                        <template #prepend>IPv4</template>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="debugHostForm.port" placeholder="6089" style="width:120px;"
                        :disabled="!isSetNewhost">
                        <template #prepend>Port</template>
                    </el-input>
                </el-form-item>
            </el-col>

            <template #footer>
                <el-button ref="btnConDialog" type="primary" :loading="connectStatu == EConnectStatu.Connecting"
                    @click="onConnectDebugger">
                    {{ connectStatu == EConnectStatu.Connecting ? "Connecting" : "Connect" }}
                </el-button>
            </template>
        </el-dialog>
    </div>
    <el-row>
        <el-image style="width: 36px; height: 36px" @click="onSetDebughost" :src="connectIco"></el-image>
        <el-text>
            {{ connectDesc }}
        </el-text>
    </el-row>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import CdpDebugger, { EConnectStatu } from '../../inc/cdp';
import { ConnectHistory, InspService } from '../../service/svr';

const avatarEmit = defineEmits(["on-connected-statu"])

const connectStatu = ref<EConnectStatu>(CdpDebugger.inc().statu)
const connectDesc = ref("")
const connectIco = ref("ui-svg/dis-connect.png")

//set type
const isSetNewhost = ref(false)

const selConShistory = ref<ConnectHistory>({
    device_name: "",
    host: ""
})

//dialog 
const isConDialogVisible = ref(true)
const listConHistory = ref<ConnectHistory[]>([])

const debugHostForm = reactive({
    device_name: "LenovoPad",
    host: "10.250.33.31",
    port: 6086
})

const updateGraphics = () => {
    switch (connectStatu.value as EConnectStatu) {
        case EConnectStatu.Connecting:
            connectDesc.value = "connecting..."
            connectIco.value = "ui-svg/connecting.png"
            break;
        case EConnectStatu.Connected:
            connectDesc.value = `host:${debugHostForm.host}`
            connectIco.value = "ui-svg/mobile.png"
            break;
        default:
            connectDesc.value = "wait to connect"
            connectIco.value = "ui-svg/dis-connect.png"
            break;
    }
    isConDialogVisible.value = (connectStatu.value != EConnectStatu.Connected)
}

const onConnectDebugger = async () => {
    //pending
    let sel_form: any
    for (const i in listConHistory.value) {
        if (Object.prototype.hasOwnProperty.call(listConHistory.value, i)) {
            const e = listConHistory.value[i];
            console.log(`compare 2 stry ${e.device_name} and ${selConShistory.value!.device_name}`)
            if (e.device_name == selConShistory.value!.device_name) {
                sel_form = e
                break
            }
        }
    }
    if (!sel_form && !isSetNewhost.value) {
        ElMessage({
            message: 'Select or enter a valid address！',
            type: 'warning',
        })
        return
    }
    //start 
    connectStatu.value = EConnectStatu.Connecting
    updateGraphics()
    let host = isSetNewhost.value ? debugHostForm.host : selConShistory.value?.host
    let port = isSetNewhost.value ? debugHostForm.port : selConShistory.value?.port
    console.log(`connect to host:${host} port:${port}`)
    let new_state = await CdpDebugger.inc().connect(host!, port)
    connectStatu.value = new_state
    updateGraphics()
    //check result
    avatarEmit('on-connected-statu', new_state)
    if (new_state != EConnectStatu.Connected) {
        ElMessage({
            message: 'Connected to v8 debugger failed!',
            type: 'warning',
        })
        return
    }
    //record
    if (isSetNewhost.value) {
        let [issuc, err] = await InspService.api_conhis.post_record_conhistory(debugHostForm, listConHistory.value)
        if (!issuc) {
            ElMessage({
                message: `Record new addr failed!${err}`,
                type: 'warning',
            })
            return
        }
    }
}

const onSetDebughost = () => {
    updateGraphics()
}


onMounted(async () => {
    let con_list = await InspService.api_conhis.get_conhistory()
    listConHistory.value = con_list
    console.log("api get history :", con_list)
    if (con_list.length > 0) {
        
        selConShistory.value = con_list[0]
        
    }
    console.log("cur -->>", selConShistory.value)
    updateGraphics()
})

</script> 


<style scoped>
:deep(.el-dialog__body) {
    padding-top: 0px;
}

:deep(.el-dialog__header) {
    background-color: aqua;
    margin-right: 0px;
    border: 1px dotted black;
}
</style>