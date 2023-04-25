<template>
    <el-dialog v-model="isConDialogVisible" title="Address" width="400px" align-center>
        <el-form-item label="Host:">
            <el-input v-model="debugHostForm.host" placeholder="127.0.0.1" />
        </el-form-item>
        <el-form-item label="Port:" s>
            <el-input v-model="debugHostForm.port" placeholder="6089" />
        </el-form-item>

        <template #footer>
            <span class="dialog-footer">
                <el-button ref="btnConDialog" type="primary" :loading="connectStatu == EConnectStatu.Connecting"
                    @click="onConnectDebugger">
                    {{ connectStatu == EConnectStatu.Connecting ? "Connecting" : "Connect" }}
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-row>
        <el-image style="width: 36px; height: 36px" @click="onSetDebughost" :src="connectIco"></el-image>
        <el-text>
            {{ connectDesc }}
        </el-text>
    </el-row>
</template>

<script setup lang="ts">
import { ElAlert, ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import CdpDebugger, { EConnectStatu } from '../../inc/cdp';

const avatarEmit = defineEmits(["on-connected-statu"])

const connectStatu = ref<EConnectStatu>(CdpDebugger.inc().statu)
const connectDesc = ref("")
const connectIco = ref("ui-svg/dis-connect.png")


//dialog 
const isConDialogVisible = ref(true)
const isCdpConnecting = ref(false)

const debugHostForm = reactive({
    host: "10.250.33.31",
    port: 6086
})

const updateConDesc = () => {
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

}

const onConnectDebugger = async () => {
    //start 
    connectStatu.value = EConnectStatu.Connecting
    updateConDesc()
    //pending
    let new_state = await CdpDebugger.inc().connect(debugHostForm.host, debugHostForm.port)
    connectStatu.value = new_state
    updateConDesc()
    //check result
    avatarEmit('on-connected-statu', new_state)
    if (new_state != EConnectStatu.Connected){
        ElMessage({
            message: 'Connected to v8 debugger failed!',
            type: 'warning',
        })
        return 
    }
    isConDialogVisible.value = false
    
}

const onSetDebughost = () => {
    isConDialogVisible.value = true
}


onMounted(() => {
    updateConDesc()
    // check cdp
    const statu = CdpDebugger.inc().statu
    if (statu == EConnectStatu.Connected) {
        isCdpConnecting.value = true
    }
})

</script> 


<style scoped></style>