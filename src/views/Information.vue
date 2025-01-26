<template>
  <div class="Container">
    <a-modal v-model:open="open" title="Network Structure" :width="800" @ok="handleOk" centered
      :okButtonProps="{ style: { backgroundColor: 'rgb(94,50,139)' } }">
      <img src="@/assets/temp.png" width="100%"></img>
    </a-modal>
    <div class="Center">
      <a-card title="Result" :bordered="true" class="LeftCard" :hoverable="true">
        <a-row :style="{ marginBottom: '20px' }">
          <a-col :span="24">
            <label>Public Variables</label>
            <a-input v-model:value="zkResult.publicVariables" />
          </a-col>
        </a-row>
        <a-row :style="{ marginBottom: '20px' }">
          <a-col :span="24">
            <label>Num Partition</label>
            <a-input v-model:value="zkResult.numPartition" />
          </a-col>
        </a-row>
        <a-row :style="{ marginBottom: '20px' }">
          <a-col :span="24">
            <label>Num Constraint</label>
            <a-input v-model:value="zkResult.numConstraint" />
          </a-col>
        </a-row>
        <a-row :style="{ marginBottom: '20px' }">
          <a-col :span="24">
            <label>Memory Cost</label>
            <a-input v-model:value="zkResult.memoryCost" />
          </a-col>
        </a-row>
        <a-row :style="{ marginBottom: '20px' }">
          <a-col :span="24">
            <label>Output</label>
            <a-textarea v-model:value="zkResult.output" :rows="5" style="resize: none;" />
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
      <a-card title="Graph" :bordered="true" class="RightCard" :hoverable="true">
        <div style="width: 100%; height:1000px;">
          <VueFlow :nodes="nodes" :edges="edges" :node-types="nodeTypes" fit-view-on-init>
            <Controls />
            <Background />
          </VueFlow>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ref } from 'vue';
import { MarkerType, VueFlow } from '@vue-flow/core';
// 引入 Vue Flow 的 CSS 文件
import '@vue-flow/core/dist/style.css';
// 如果需要默认主题，可以引入默认主题样式
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import { Controls } from '@vue-flow/controls';
import { Background } from '@vue-flow/background';
import ZKNode from '@/components/ZKNode.vue';

interface ZKResult {
  publicVariables: string;
  numPartition: string;
  numConstraint: string;
  memoryCost: string;
  output: string;
}
const zkResult = reactive<ZKResult>({
  publicVariables: '0x1234567890abcdef', // 写死的公共变量
  numPartition: '4', // 写死的分区数
  numConstraint: '50', // 写死的约束数
  memoryCost: '256.75', // 写死的内存消耗
  output: '0x9876543210fedcba' // 写死的输出
});


const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};
const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};

// 定义节点和边的初始状态
const nodes = ref([
  { id: '1', position: { x: 0, y: 0 },  type: 'custom', data: { label: 'Node 1' }, },
  { id: '2', position: { x: 600, y: 600 }, type: 'custom', data: { label: 'Node 2' }, },
  { id: '3', position: { x: -400, y: 1100 }, type: 'custom', data: { label: 'Node 3' }, },
]);
const edges = ref([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    markerEnd: { type: MarkerType.Arrow } // 使用 MarkerType.Arrow
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    markerEnd: { type: MarkerType.Arrow } // 使用 MarkerType.Arrow
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    markerEnd: { type: MarkerType.Arrow } // 使用 MarkerType.Arrow
  },
]);
// 注册自定义节点类型
const nodeTypes = {
  custom: ZKNode, // 将自定义节点组件注册为 'custom' 类型
};

</script>

<style scoped>
.Container {
  height: 100%;
  width: 100%;
}

.Center {
  margin: auto;
  width: 2000px;
  height: 950px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.LeftCard * {
  font-size: 25px;
}

.RightCard * {
  font-size: 25px;
}


/* 设置卡片的样式 */
.LeftCard {
  position: absolute;
  left: 0;
  top: 0;
  width: 500px;
  /* 卡片的宽度 */
  height: 1100px;
}

.RightCard {
  position: absolute;
  left: 550px;
  top: 0;
  width: 1500px;
  /* 卡片的宽度 */
  height: 1100px;
}
</style>