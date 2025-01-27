<template>
    <a-card class="custom-node" :title="data.partition">
        <a-row gutter={24}>
            <a-col span="8">
                <span style="font-weight: 600;">Public Inputs:</span> <a-tag color="blue">{{ data.publicInputs }}</a-tag>
            </a-col>
            <a-col span="8">
                <span style="font-weight: 600;">Private Inputs:</span> <a-tag color="green">{{ data.privateInputs }}</a-tag>
            </a-col>
            <a-col span="8">
                <span style="font-weight: 600;">Constraints:</span> <a-tag color="orange">{{ data.constraints }}</a-tag>
            </a-col>
        </a-row>
        <a-row gutter={24} style="margin-top:10px">
            <a-col span="8">
                <span style="font-weight: 600;">Shared Inputs:</span> <a-tag color="purple">{{ data.sharedInputs }}</a-tag>
            </a-col>
            <a-col span="9">
                <span style="font-weight: 600;"> Shared Outputs:</span> <a-tag color="red">{{ data.sharedOutputs }}</a-tag>
            </a-col>
        </a-row>

        <Handle id="source-left" :type="'source'" :position="Position.Left" />
        <Handle id="source-top" :type="'source'" :position="Position.Top" />
        <Handle id="source-right" :type="'source'" :position="Position.Right" />
        <Handle id="source-bottom" :type="'source'" :position="Position.Bottom" />

        <Handle id="target-left" :type="'target'" :position="Position.Left" />
        <Handle id="target-top" :type="'target'" :position="Position.Top" />
        <Handle id="target-right" :type="'target'" :position="Position.Right" />
        <Handle id="target-bottom" :type="'target'" :position="Position.Bottom" />
    </a-card>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core';
import { defineProps } from 'vue';
const props =defineProps(["data"])
console.log(props)

// const props = defineProps({
//   partition: {
//     type: String,
//     required: true, // 确保必需
//   },
//   publicInputs: {
//     type: Number,
//     required: true,
//   },
//   privateInputs: {
//     type: Number,
//     required: true,
//   },
//   constraints: {
//     type: Number,
//     required: true,
//   },
//   sharedInputs: {
//     type: Number,
//     required: true,
//   },
//   sharedOutputs: {
//     type: Number,
//     required: true,
//   },
// });
console.log(props)
</script>

<style scoped>
.custom-node {
    width: 550px;
    height: 150px;
    background: #ffffff;
    border: 1px solid black;
    border-radius: 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.node-header {
    font-size: 16px;
    color: #333;
    font-weight: bold; /* 加粗标题文字 */
    text-align: center;
}

.node-info {
    font-size: 14px;
    color: #555;
    font-weight: bold; /* 加粗信息文字 */
    text-align: center;
}

a-tag {
    font-weight: bold; /* 加粗标签文字 */
}

a-col {
    font-weight: bold; /* 加粗列内容 */
}

.Handle {
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: #0077b6;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.Handle.Left {
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
}

.Handle.Top {
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
}

.Handle.Right {
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
}

.Handle.Bottom {
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
