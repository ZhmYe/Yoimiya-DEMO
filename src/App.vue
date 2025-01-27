<template>
  <!-- <a-card title="Matrix Multiplication ZKP" bordered> -->
    <a-card title="Input Setup" bordered>
    <!-- 表单部分 -->
    <a-form>
      <a-row :gutter="24">
        <!-- 矩阵 A 的维度 -->
        <a-col span="8">
          <a-form-item label="Matrix A Size">
            <a-input-group compact>
              <a-input style="width: 50%" placeholder="Rows (A)" number="300" />
              <a-input style="width: 50%" placeholder="Cols (A)" number="300" />
            </a-input-group>
          </a-form-item>
        </a-col>
        <!-- 矩阵 B 的维度 -->
        <a-col span="8">
          <a-form-item label="Matrix B Size">
            <a-input-group compact>
              <a-input style="width: 50%" placeholder="Rows (B)" number="300" />
              <a-input style="width: 50%" placeholder="Cols (B)" number="300" />
            </a-input-group>
          </a-form-item>
        </a-col>
        <!-- 分区数量 -->
        <a-col span="8">
          <a-form-item label="Partition Number">
            <a-input placeholder="Enter number of partitions" number="3" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row justify="center">
        <a-col>
          <a-button type="primary">Generate</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
    <!-- 上方区域：JSON 展示 -->  
    <a-row gutter="24">
      <!-- JSON 区域：左侧展示矩阵 C 和 proof -->
      <a-col :span="12">
        <a-card title="ZK-SNARK Proof">
          <div id="json-editor" style="height: 500px;"></div>
        </a-card>
      </a-col>

      <!-- Execution DAG 区域：右侧展示 Execution DAG -->
      <a-col :span="12">
        <a-card title="Partitioning Result">
          <div style="width: 100%; height: 500px;">
            <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init>
              <Controls />
              <Background />
            </VueFlow>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 下方区域：表格和图表 -->
    <a-row gutter="24" style="margin-top: 20px;">
      <!-- 表格和图表区域合并为 System Performance -->
      <a-col :span="24">
        <a-card title="System Performance">
          <a-row gutter="24">
            <!-- 表格展示区域 -->
            <a-col :span="12">
              <a-table :columns="columns" :dataSource="tableData" bordered :pagination="false">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'circuit'">
                    <a> {{ record.circuit }} </a>
                  </template>
                </template>
              </a-table>
            </a-col>

            <!-- 图表展示区域：内存柱状图和时间堆叠柱状图 -->
            <a-col :span="12">
              <a-row gutter="24">
                <!-- 柱状图：内存使用 -->
                <a-col :span="12">
                  <div id="memoryBarChart" style="width: 100%; height: 360px;"></div>
                </a-col>
                <!-- 堆叠柱状图：时间 -->
                <a-col :span="12">
                  <div id="timeStackedBarChart" style="width: 100%; height: 360px;"></div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  <!-- </a-card> -->
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import { MarkerType, VueFlow } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import { Controls } from '@vue-flow/controls';
import { Background } from '@vue-flow/background';
import * as echarts from 'echarts';

// 硬编码的 300x300 矩阵
const hardcodedMatrixC = Array(300).fill(0).map(() => Array(300).fill(Math.random() * 100));

// 零知识证明数据
const proof = ref({
  proof: {
    shared_inputs: Array(121121).fill(0),
    shared_outputs: Array(120003).fill(0),
    a: [
      "0x1a20e8392f0fbb5718a299c3a555d9a5e3b57d54b3816b66b9539cc4ee090eaf",
      "0x3ba7f27622d93a7c27a2bc4e8f49ac94e5f74095f7b8b0788f13e97b4132ad7f"
    ],
    b: [
      [
        "0x1b4f1f03814a3743ec897f1f00a558330e76e4e5f7228db0e7a1d52cb04023fc",
        "0x0e15b7d6d2274c2a1ff5a65f07b0baf970e1b40189b0c6b600de9f7c5a899054"
      ],
      [
        "0x0f9d1c477be4338a6cfbe01478b0221b4c800c4ed779e839989e56e5759a6c2f",
        "0x0b6d1f8c8bcd82d3e2a1b4ca3d1f0645d319ee8a7e9f59d7ea1e903d2fbdab72"
      ]
    ],
    c: [
      "0x17e0143488269e9863f1d9d6d88362cd97a482fcb387953b8c27a44035e990d4",
      "0x0c2e9be14b3033f47a17963d9d45e4b8e02f7bbec7988d2be9a874545758f2ad"
    ]
  }
});

const matrixC = ref(hardcodedMatrixC); // 使用硬编码的矩阵 C

// 表格数据（内存、时间），行列互换并增加汇总
const columns = [
  { title: 'Circuit', dataIndex: 'circuit', key: 'circuit' },
  { title: 'Constraints Number', dataIndex: 'constraints', key: 'constraints' },
  { title: 'Total Memory Cost', dataIndex: 'memory', key: 'memory' },
  { title: 'Proof Memory Cost', dataIndex: 'proofMemory', key: 'proofMemory' },
  { title: 'Proof Generation Time', dataIndex: 'proofTime', key: 'proofTime' }
];

const tableData = [
  { circuit: 'Original Circuit', constraints: '54000000', memory: '49.9247GB', proofMemory: '14.8866GB', proofTime: '28.0164s' },
  { circuit: 'Sub Circuit 1', constraints: '18132348', memory: '26.3117GB', proofMemory: '6.6346GB', proofTime: '10.8098s' },
  { circuit: 'Sub Circuit 2', constraints: '18132348', memory: '25.1237GB', proofMemory: '6.6335GB', proofTime: '10.4256s' },
  { circuit: 'Sub Circuit 3', constraints: '18253283', memory: '25.9132GB', proofMemory: '6.6346GB', proofTime: '11.8145s' },
  // { circuit: 'Summary', constraints: '108900000', memory: '127.2732GB', proofMemory: '34.7593GB', proofTime: '61.0663s' }
];

// 节点和边的初始状态
const nodes = ref([
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Partition 1' }, style: { width: 100, height: 50 } },
  { id: '2', position: { x: 100, y: 300 }, data: { label: 'Partition 2' }, style: { width: 100, height: 50 } },
  { id: '3', position: { x: 400, y: 300 }, data: { label: 'Partition 3' }, style: { width: 100, height: 50 } }
]);

const edges = ref([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'Shared Variables Number: 121121',
    labelStyle: { fontSize: 12, fill: '#000' },
    style: { strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    label: 'Shared Variables Number: 120003',
    labelStyle: { fontSize: 12, fill: '#000' },
    style: { strokeWidth: 2 },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    label: 'Shared Variables Number: 119897',
    labelStyle: { fontSize: 12, fill: '#000' },
    style: { strokeWidth: 2 },
  },
]);


// 图表初始化
onMounted(() => {
  const jsonData = {
    proof1: proof.value,
    proof2: proof.value,
    proof3: proof.value,
    matrixC: matrixC.value,
  };
  // 初始化 JSONEditor，移除搜索框
  const container = document.getElementById('json-editor') as HTMLElement;
  const options = {
    mode: 'view',
    onChange: function () { console.log(editor.get()); }
  };
  const editor = new JSONEditor(container, options);
  editor.set(jsonData);
  const legendOptions = {
  type: 'scroll', // 启用滚动
  right: 10, // 靠右显示
  data: ['Original Circuit', 'Sub Circuit 1', 'Sub Circuit 2', 'Sub Circuit 3'],
};

const memoryChart = echarts.init(document.getElementById('memoryBarChart'));
memoryChart.setOption({
  tooltip: {},
  xAxis: { type: 'category', data: ['Prove Memory', 'Total Memory'] },
  yAxis: { type: 'value', name: 'Memory(GB)' },
  legend: legendOptions, // 共享图例
  series: [
    { name: 'Original Circuit', type: 'bar', data: [49.9247, 14.8866] },
    { name: 'Sub Circuit 1', type: 'bar', data: [26.3117, 6.6312] },
    { name: 'Sub Circuit 2', type: 'bar', data: [25.1237, 6.6335] },
    { name: 'Sub Circuit 3', type: 'bar', data: [25.9132, 6.6346] },
  ],
});

const timeChart = echarts.init(document.getElementById('timeStackedBarChart'));
timeChart.setOption({
  tooltip: {},
  legend: legendOptions, // 共享图例
  xAxis: { type: 'category', data: ['Original Circuit', 'Sub Circuits'] },
  yAxis: { type: 'value', name: 'Time (s)' },
  series: [
    { name: 'Original Circuit', type: 'bar', stack: 'total', data: [28.0164, 0] },
    { name: 'Sub Circuit 1', type: 'bar', stack: 'total', data: [0, 10.809886404] },
    { name: 'Sub Circuit 2', type: 'bar', stack: 'total', data: [0, 10.425607666] },
    { name: 'Sub Circuit 3', type: 'bar', stack: 'total', data: [0, 11.814508779] },
  ],
});

});
</script>

<style scoped>
/* 可以根据需要进一步调整样式 */
</style>
