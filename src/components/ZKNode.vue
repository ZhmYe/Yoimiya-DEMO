<template>
    <a-modal v-model:open="open" title="Network Structure" :width="800" @ok="handleOk" centered
        :okButtonProps="{ style: { backgroundColor: 'rgb(94,50,139)' } }">
        <img src="@/assets/temp.png" width="100%"></img>
    </a-modal>
    <a-card title="Result" :bordered="true" class="LeftCard" :hoverable="true">
        <a-row :style="{ marginBottom: '20px' }">
            <a-col :span="24">
                <label>Public Variables</label>
                <a-input />
            </a-col>
        </a-row>
        <a-row :style="{ marginBottom: '20px' }">
            <a-col :span="24">
                <label>Num Partition</label>
                <a-input />
            </a-col>
        </a-row>
        <a-row :style="{ marginBottom: '20px' }">
            <a-col :span="24">
                <label>Memory Cost</label>
                <a-input />
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="10" :offset="7" style="margin-top: 40px;">
                <a-button type="primary" @click="showModal"
                    style="width: 100%; ;height: 100px;background-color: rgb(94,50,139);">
                    Show Struct
                </a-button>
            </a-col>
        </a-row>
    </a-card>
</template>

<script lang="ts" setup>import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

const open = ref<boolean>(false);
const showModal = () => {
    open.value = true;
};
const handleOk = (e: MouseEvent) => {
    console.log(e);
    open.value = false;
};
</script>

<style scoped>
.Card {
    width: 600px;
    height: 500px;
}
</style>