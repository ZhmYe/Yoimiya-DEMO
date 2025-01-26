<template>
  <a-card title="Input Set" bordered>
    <!-- 表单部分 -->
    <a-form>
      <a-row :gutter="24">
        <!-- 矩阵 A 的维度 -->
        <a-col span="8">
          <a-form-item label="Matrix A Size">
            <a-input-group compact>
              <a-input style="width: 50%" placeholder="Rows (A)" v-model:number="matrixA.rows" />
              <a-input style="width: 50%" placeholder="Cols (A)" v-model:number="matrixA.cols" />
            </a-input-group>
          </a-form-item>
        </a-col>
        <!-- 矩阵 B 的维度 -->
        <a-col span="8">
          <a-form-item label="Matrix B Size">
            <a-input-group compact>
              <a-input style="width: 50%" placeholder="Rows (B)" v-model:number="matrixB.rows" />
              <a-input style="width: 50%" placeholder="Cols (B)" v-model:number="matrixB.cols" />
            </a-input-group>
          </a-form-item>
        </a-col>
        <!-- 分区数量 -->
        <a-col span="8">
          <a-form-item label="Partition Number">
            <a-input placeholder="Enter number of partitions" v-model:number="partitionNumber" />
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

  <!-- 第一部分：电路信息展示 -->
  <a-card>
    <a-row gutter="24">
      <!-- 左侧：不划分电路的信息 -->
      <a-col :span="12" class="LeftCard">
        <a-card title="Original Circuit Information">
          <a-list bordered size="large">
              <!-- 第一个列表项 -->
              <a-list-item>
                <a-row gutter={16} style="width: 100%">
                  <a-col :span="8">
                    <strong>Constraints Number:</strong> 
                    <a-tag color="purple">54000000</a-tag>
                  </a-col>
                  <a-col :span="8">
                    <strong>Total Memory Cost:</strong> 
                    <a-tag color="pink">49.9247GB</a-tag>
                  </a-col>
                  <a-col :span="8">
                    <strong>Prove Memory Cost:</strong> 
                    <a-tag color="pink">14.8866GB</a-tag>
                  </a-col>
                </a-row>
              </a-list-item>


              <a-list-item>
                <a-row gutter={16} style="width: 100%">
                 <a-col :span="8">
                    <strong>Proof Generation Time:</strong> 
                    <a-tag color="orange">28.0164s</a-tag>
                  </a-col>
                  <a-col :span="8">
                    <strong>Public Input Size:</strong> 
                    <a-tag color="blue">270000</a-tag>
                  </a-col>

                </a-row>
              </a-list-item>
              <a-list-item style="justify-content: center;">
                <a-button type="primary">View Proof Details</a-button>               <!-- 这里最好可以用echarts来一个树状图，验证merkler root -->
              </a-list-item>
            </a-list>
        </a-card>
        <a-card title="Sub Circuits Information">
          <a-tabs>
            <a-tab-pane v-for="(info, index) in partitionInfo" :key="index" :tab="`Partition ${index + 1}`">
              <a-list bordered size="large">
              <!-- 第一个列表项 -->
              <a-list-item>
                <a-row gutter={16} style="width: 100%">
                  <a-col :span="8">
                    <strong>Constraints Number:</strong> 
                    <a-tag color="purple">18132348</a-tag>
                  </a-col>
                  <a-col :span="8">
                    <strong>Total Memory Cost:</strong> 
                    <a-tag color="pink">25.9381GB</a-tag>
                  </a-col>
                  <a-col :span="8">
                    <strong>Prove Memory Cost:</strong> 
                    <a-tag color="pink">6.5218GB</a-tag>
                  </a-col>
                </a-row>
              </a-list-item>


              <a-list-item>
                <a-row gutter={16} style="width: 100%">
                 <a-col :span="8">
                    <strong>Proof Generation Time:</strong> 
                    <a-tag color="orange">10.8098s</a-tag>
                  </a-col>
                  <a-col :span="8">
                    <strong>Public Input Size:</strong> 
                    <a-tag color="blue">132348</a-tag>
                  </a-col>
                </a-row>
              </a-list-item>
              <a-list-item style="justify-content: center;">
                <a-button type="primary">View Proof Details</a-button>       
              </a-list-item>
            </a-list>
            </a-tab-pane>
          </a-tabs>
        <a-card title="Overview" style="margin-top: 10px;">
          <!-- <a-list bordered size="large" > -->

              <!-- <a-list-item> -->
                <!-- <a-card title="Detailed Metrics" bordered> -->
                <a-row gutter={24} style="width: 80%; margin: 0 auto;">
                  <a-col :span="8">
                    <a-progress type="circle" :percent="Math.round((26.3117 / 49.9247) * 100 * 100) / 100" :size="100" />
                    <a-statistic title="Max Total Memory" value="26.3117GB"/>
                  </a-col>
                  <a-col :span="8">
                    <a-progress type="circle" :percent="Math.round((6.6346 / 14.8866) * 100 * 100) / 100" :size="100" />
                    <a-statistic title="Max Prove Memory" value="6.6346GB'" />
                  </a-col>
                  <a-col :span="8">
                    <a-progress type="circle" :percent="Math.round((18253283 / 54000000) * 100 * 100) / 100" :size="100" />
                    <a-statistic title="Max Constraint Number" value="18253283" />
                  </a-col>
                </a-row>
              <!-- </a-card> -->
              <!-- </a-list-item> -->
            <!-- </a-list> -->
          </a-card>
        </a-card>
      </a-col>

      <!-- 右侧：划分后的电路信息 -->
      <a-col :span="12" class="RightCard">
         <!-- 第一部分：Execution DAG 展示 -->
  <a-card>
    <a-row>
      <a-col :span="24">
        <a-card title="Execution DAG" :bordered="true">
          <div style="width: 100%; height: 280px;">
            <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init>
              <Controls />
              <Background />
            </VueFlow>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-card>

  <!-- 第二部分：图表展示 -->
  <a-card title="Analysis Charts" bordered>
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
  </a-card>

      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import ZKNode from '@/components/ZKNode.vue';
import * as echarts from 'echarts';
import { MarkerType, VueFlow } from '@vue-flow/core';
// 引入 Vue Flow 的 CSS 文件
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import { Controls } from '@vue-flow/controls';
import { Background } from '@vue-flow/background';
// 表单数据
const matrixA = reactive({ rows: 0, cols: 0 });
const matrixB = reactive({ rows: 0, cols: 0 });
const partitionNumber = ref(0);

// 电路信息
const nonPartitionInfo = ref({
  constraints: 1000,
  memory: '200MB',
  time: '15s',
});
const partitionInfo = ref([
  { constraints: 300, memory: '80MB', time: '10s' },
  { constraints: 300, memory: '80MB', time: '10s' },
  { constraints: 400, memory: '90MB', time: '10s' },
]);

// 查看证明详情
const viewProofDetails = (type: string) => {
  alert(`Displaying proof details for ${type}`);
};

// 生成电路的函数
// const generateCircuits = () => {
//   if (matrixA.cols !== matrixB.rows || partitionNumber.value <= 0) {
//     alert('Invalid input! Ensure Matrix A columns equal Matrix B rows and partition number > 0.');
//     return;
//   }
// };

// 节点和边的初始状态
const nodes = ref([
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Partition 1' }, style: { width: 100, height: 50 } },
  { id: '2', position: { x: 100, y: 300 }, data: { label: 'Partition 2' }, style: { width: 100, height: 50 } },
  { id: '3', position: { x: 400, y: 300 }, data: { label: 'Partition 3' }, style: { width: 100, height: 50 } },
]);

const edges = ref([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'Shared Variables Number: 12121',
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

const generateCircuits = () => {
  if (matrixA.cols !== matrixB.rows || partitionNumber.value <= 0) {
    alert('Invalid input! Ensure Matrix A columns equal Matrix B rows and partition number > 0.');
    return;
  }
};

// 图表初始化
onMounted(() => {
  const memoryChart = echarts.init(document.getElementById('memoryBarChart'));
memoryChart.setOption({
  tooltip: {},
  xAxis: { type: 'category', data: ['Prove Memory', 'Total Memory'] },
  yAxis: { type: 'value', name: 'Memory(GB)' }, // 添加纵坐标
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
  legend: {
    type: 'scroll', // 启用滚动
    // orient: 'vertical', // 垂直布局
    right: 10, // 靠右显示
    // top: 20, // 向下偏移
    // bottom: 20, // 向上偏移
    data: ['Original Circuit Time', 'Sub Circuit 1', 'Sub Circuit 2', 'Sub Circuit 3'], // 图例数据
  },
  xAxis: { type: 'category', data: ['Original Circuit', 'Sub Circuits'] },
  yAxis: { type: 'value', name: 'Time (s)' }, // 添加纵坐标
  series: [
    { name: 'Original Circuit Time', type: 'bar', stack: 'total', data: [28.0164, 0] }, // 原始电路时间
    { name: 'Sub Circuit 1', type: 'bar', stack: 'total', data: [0, 10.809886404] }, // 子电路 1 时间
    { name: 'Sub Circuit 2', type: 'bar', stack: 'total', data: [0, 10.425607666] }, // 子电路 2 时间
    { name: 'Sub Circuit 3', type: 'bar', stack: 'total', data: [0, 11.814508779] }, // 子电路 3 时间
  ],
});


});


</script>

<style scoped>
.LeftCard, .RightCard {
  height: 100%;
}
</style>
