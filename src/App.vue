<template>
  <!-- 输入设置区域 -->
  <a-card title="Input Setup" bordered>
    <a-form>
      <a-row :gutter="24">
        <a-col span="8">
          <a-form-item label="W Shape">
            <a-input-group compact>
              <a-input style="width: 50%" placeholder="Input Dim" number="300" />
              <a-input style="width: 50%" placeholder="Output Dim" number="300" />
            </a-input-group>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item label="X Shape">
            <a-input-group compact>
              <a-input style="width: 50%" placeholder="Batch Size" number="300" />
              <a-input style="width: 50%" placeholder="Data Length" number="300" />
            </a-input-group>
          </a-form-item>
        </a-col>
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

  <!-- 电路代码展示和零知识证明展示 -->
  <a-row gutter="24">
    <a-col :span="12">
      <a-card title="Circuit Code" style="height: 650px;">
        <pre v-pre>
<code class="language-go">
type MatrixMultiplicationCircuit struct {
	W [300][300]frontend.Variable `gnark:"W"`
	X [300][300]frontend.Variable `gnark:"X"`
	Y [300][300]frontend.Variable `gnark:",public"`
}
func (c *MatrixMultiplicationCircuit) Define(api frontend.API) error {
	var tmp [300][300]frontend.Variable
	for i := 0; i < 300; i++ {
		for j := 0; j < 300; j++ {
			tmp[i][j] = frontend.Variable(0)
			for k := 0; k < 300; k++ {
				tmp[i][j] = api.Add(tmp[i][j], api.Mul(c.W[i][k], c.X[k][j]))
			}
		}
	}
	for i := 0; i < 300; i++ {
		for j := 0; j < 300; j++ {
			api.AssertIsEqual(c.Y[i][j], tmp[i][j])
		}
	}
	return nil
}</code>
        </pre>
      </a-card>
    </a-col>

    <a-col :span="12">
      <!-- <a-card title="ZK-SNARK Proof"> -->
        <div id="json-editor" style="height: 650px;"></div>
      <!-- </a-card> -->
    </a-col>
  </a-row>

  <!-- Execution DAG 和系统性能展示 -->
  <a-row gutter="24" style="margin-top: 20px;">
    <a-col :span="12">
      <a-card title="Partitioning Visualization">
        <div style="width: 100%; height: 350px;">
          <VueFlow :nodes="nodes" :edges="edges">
            <Controls />
            <!-- <Background /> -->
            <template #node-custom="customNodeProps">
              <!-- {{ customNodeProps }} -->
              <PartitionNode v-bind="customNodeProps" />
            </template>
          </VueFlow>
        </div>
      </a-card>
    </a-col>

    <a-col :span="12">
      <a-card title="System Performance">
        <a-row gutter="24">
          <a-col :span="24">
            <a-row gutter="24">
                <!-- 柱状图：内存使用 -->
                <a-col :span="15">
                  <div id="memoryBarChart" style="width: 100%; height: 360px;"></div>
                </a-col>
                <!-- 堆叠柱状图：时间 -->
                <a-col :span="9">
                  <div id="timeStackedBarChart" style="width: 100%; height: 360px;"></div>
                </a-col>
              </a-row>
            <!-- <a-table :columns="columns" :dataSource="tableData" bordered :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'circuit'">
                  <a> {{ record.circuit }} </a>
                </template>
              </template>
            </a-table> -->
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
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
import { Handle, Position } from "@vue-flow/core";
// import Prism from 'prismjs';  // 导入 Prism 库
import 'prismjs/themes/prism.css'; // 导入默认的 Prism 主题
import Prism from "prismjs";  // 导入 Prism 库
import 'prismjs'; // 导入 prismjs
// import 'prismjs/themes/prism.css';  // 导入默认主题
import 'prismjs/components/prism-go.min.js'; // 导入 Go 语言高亮支持
import * as echarts from 'echarts';
import PartitionNode from "./components/PartitionNode.vue";
const nodeTypes = {
  custom: PartitionNode, // 将自定义节点组件注册为 'custom' 类型
};

// 定义节点
const nodes = ref([
  {
    id: '1',
    position: { x: 250, y: 50 },
    data: {
      label: '1',
      partition: 'Partition 1',
      publicInputs: 0,
      privateInputs: 90000,
      constraints: 18132348,
      sharedInputs: 0,
      sharedOutputs: 241124,
    },
    style: { width: 200, height: 50 },
    type: 'custom',
  },
  {
    id: '2',
    position: { x: 500, y: 50 },
    data: {
      label: '2',

      partition: 'Partition 2',
      publicInputs: 0,
      privateInputs: 90000,
      constraints: 17614369,
      sharedInputs: 121121,
      sharedOutputs: 119897,
    },
    style: { width: 200, height: 50 },
    type: 'custom',
  },
  {
    id: '3',
    position: { x: 750, y: 50 },
    data: {
      label: '3',

      partition: 'Partition 3',
      publicInputs: 90000,
      privateInputs: 0,
      constraints: 18253283,
      sharedInputs: 200,
      sharedOutputs: 160,
    },
    style: { width: 200, height: 50 },
    type: 'custom',
  },
]);

// 定义边的配置
const edges = ref([
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    type: 'smoothstep', 
    markerEnd: { type: MarkerType.Arrow }, 
    animated: true,
    label: 'shared variables: 121121', 
    style: { stroke: 'blue' },
    labelStyle: { fill: 'black', fontSize: '12px', fontWeight: 'bold' },
    sourceHandle: 'source-right',
    targetHandle: 'target-left'
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    type: 'smoothstep', 
    markerEnd: { type: MarkerType.Arrow }, 
    animated: true,
    label: 'shared variables: 120003', 
    style: { stroke: 'blue' },
    labelStyle: { fill: 'black', fontSize: '12px', fontWeight: 'bold' },
    sourceHandle: 'source-bottom',
    targetHandle: 'target-top'
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3', 
    type: 'smoothstep', 
    markerEnd: { type: MarkerType.Arrow }, 
    animated: true,
    label: 'shared variables: 119897', 
    style: { stroke: 'blue' },
    labelStyle: { fill: 'black', fontSize: '12px', fontWeight: 'bold' },
    sourceHandle: 'source-bottom',
    targetHandle: 'target-top'
  },
]);

// 硬编码的 300x300 矩阵
const hardcodedMatrixC = Array(300).fill(0).map(() => Array(300).fill(0).map(() => Math.ceil(Math.random() * 100)));

// 零知识证明数据
const proof = ref({
  proof: {
    shared_inputs: Array(121121).fill(0).map(()=>Math.ceil(Math.random() * 100)),
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
];

onMounted(() => {
  const jsonData = {
    proof1: proof.value,
    proof2: proof.value,
    proof3: proof.value,
    Y: matrixC.value,
  };
  const editor = new JSONEditor(document.getElementById('json-editor'), {
    mode: 'view',
    search: false,
  });

  editor.set(jsonData); // 展示零知识证明
  Prism.highlightAll();
 
  const memoryChart = echarts.init(document.getElementById('memoryBarChart'));
memoryChart.setOption({
  tooltip: {},
  title: {
    text: 'Memory Usage',
    left: 'center',
    bottom: '5%',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333', // 设置标题颜色为黑色
    }
  },
  xAxis: {
    type: 'category',
    data: ['Prove Memory', 'Total Memory'],
    axisLine: {
      lineStyle: {
        color: 'black', // 设置X轴线条为灰色
      },
    },
    axisTick: {
      lineStyle: {
        color: 'black', // 设置X轴刻度线颜色
      },
    },
    axisLabel: {
      color: '#333333', // 设置X轴标签的字体颜色为深灰色
      fontWeight: 'bold', // 设置字体加粗
    },
  },
  yAxis: {
    type: 'value',
    name: 'Memory (GB)',
    axisLine: {
      lineStyle: {
        color: 'black', // 设置Y轴线条为灰色
      },
    },
    axisTick: {
      lineStyle: {
        color: 'black', // 设置Y轴刻度线颜色
      },
    },
    axisLabel: {
      color: '#333333', // 设置Y轴标签的字体颜色为深灰色
      fontWeight: 'bold', // 设置字体加粗
    },
  },
  legend: {
    data: ['Original Circuit', 'Subcircuit 1', 'Subcircuit 2', 'Subcircuit 3'],
    type: 'scroll', // 启用滚动
    textStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#333',
    },
  },
  series: [
    {
      name: 'Original Circuit',
      type: 'bar',
      data: [49.9247, 14.8866],
      itemStyle: {
        color: '#4C92B0',
        pattern: {
          type: 'line',
          width: 5,  // 增加纹理的宽度
          color: '#4C92B0',  // 配合柱子颜色
          shadowColor: '#4C92B0',
        }, // 添加斜线纹理
      },
      barWidth: 30, // 设置柱子的宽度
    },
    {
      name: 'Subcircuit 1',
      type: 'bar',
      data: [26.3117, 6.6312],
      itemStyle: {
        color: '#6AAB56',
        pattern: {
          type: 'line',
          width: 5,
          color: '#6AAB56',
          shadowColor: '#6AAB56',
        }, // 添加斜线纹理
      },
      barWidth: 30,
    },
    {
      name: 'Subcircuit 2',
      type: 'bar',
      data: [25.1237, 6.6335],
      itemStyle: {
        color: '#F4A261',
        pattern: {
          type: 'line',
          width: 5,
          color: '#F4A261',
          shadowColor: '#F4A261',
        }, // 添加斜线纹理
      },
      barWidth: 30,
    },
    {
      name: 'Subcircuit 3',
      type: 'bar',
      data: [25.9132, 6.6346],
      itemStyle: {
        color: '#9B59B6',
        pattern: {
          type: 'line',
          width: 5,
          color: '#9B59B6',
          shadowColor: '#9B59B6',
        }, // 添加斜线纹理
      },
      barWidth: 30,
    },
  ],
});


const timeChart = echarts.init(document.getElementById('timeStackedBarChart'));
timeChart.setOption({
  tooltip: {},
  title: {
    text: 'Proof Generation Time', // 设置标题
    left: 'center',
    bottom: '5%',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333', // 设置标题颜色为黑色
    },
  },
  legend: {
    data: ['Original Circuit', 'Subcircuit 1', 'Subcircuit 2', 'Subcircuit 3'],
    type: 'scroll', // 启用滚动
    textStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#333',
    },
  },
  xAxis: {
    type: 'category',
    data: ['Original Circuit', 'Sub Circuits'],
    axisLine: {
      lineStyle: {
        color: 'black', // 设置X轴线条为黑色
      },
    },
    axisTick: {
      lineStyle: {
        color: 'black', // 设置X轴刻度线颜色
      },
    },
    axisLabel: {
      color: 'black', // 设置X轴标签的字体颜色为黑色
      fontWeight: 'bold', // 设置字体加粗
    },
  },
  yAxis: {
    type: 'value',
    name: 'Time (s)',
    axisLine: {
      lineStyle: {
        color: 'black', // 设置Y轴线条为黑色
      },
    },
    axisTick: {
      lineStyle: {
        color: 'black', // 设置Y轴刻度线颜色
      },
    },
    axisLabel: {
      color: 'black', // 设置Y轴标签的字体颜色为黑色
      fontWeight: 'bold', // 设置字体加粗
    },
  },
  series: [
    {
      name: 'Original Circuit',
      type: 'bar',
      stack: 'total',
      data: [28.0164, 0],
      itemStyle: {
        color: '#4C92B0',
        pattern: {
          type: 'line',
          width: 5,
          color: '#4C92B0',
          shadowColor: '#4C92B0',
        }, // 添加斜线纹理
      },
      barWidth: 40, // 设置柱子的宽度
    },
    {
      name: 'Subcircuit 1',
      type: 'bar',
      stack: 'total',
      data: [0, 10.809886404],
      itemStyle: {
        color: '#6AAB56',
        pattern: {
          type: 'line',
          width: 5,
          color: '#6AAB56',
          shadowColor: '#6AAB56',
        }, // 添加斜线纹理
      },
      barWidth: 40,
    },
    {
      name: 'Subcircuit 2',
      type: 'bar',
      stack: 'total',
      data: [0, 10.425607666],
      itemStyle: {
        color: '#F4A261',
        pattern: {
          type: 'line',
          width: 5,
          color: '#F4A261',
          shadowColor: '#F4A261',
        }, // 添加斜线纹理
      },
      barWidth: 40,
    },
    {
      name: 'Subcircuit 3',
      type: 'bar',
      stack: 'total',
      data: [0, 11.814508779],
      itemStyle: {
        color: '#9B59B6',
        pattern: {
          type: 'line',
          width: 5,
          color: '#9B59B6',
          shadowColor: '#9B59B6',
        }, // 添加斜线纹理
      },
      barWidth: 40,
    },
  ],
});
//   xAxis: {
//     type: 'category',
//     data: ['Original', 'Subcircuit 1', 'Subcircuit 2', 'Subcircuit 3'], // X轴标签
//     axisLine: {
//       lineStyle: {
//         color: 'black', // 设置X轴线条为灰色
//       },
//     },
//     axisTick: {
//       lineStyle: {
//         color: 'black', // 设置X轴刻度线颜色
//       },
//     },
//     axisLabel: {
//       color: 'black', // 设置X轴标签的字体颜色为深灰色
//       fontWeight: 'bold', // 设置字体加粗
//     },
//     show: true, // 隐藏X轴标签
//   },
//   yAxis: {
//     type: 'value',
//     name: 'Time (s)',
//     axisLine: {
//       lineStyle: {
//         color: 'black', // 设置Y轴线条为灰色
//       },
//     },
//     axisTick: {
//       lineStyle: {
//         color: 'black', // 设置Y轴刻度线颜色
//       },
//     },
//     axisLabel: {
//       color: 'black', // 设置Y轴标签的字体颜色为深灰色
//       fontWeight: 'bold', // 设置字体加粗
//     },
//   },
//   series: [
//     {
//       name: 'Time',
//       type: 'bar',
//       data: [28.0164, 10.809886404, 10.425607666, 11.814508779], // 四个数据
//       itemStyle: {
//         color: function(params) {
//           const colors = ['#4C92B0', '#6AAB56', '#F4A261', '#9B59B6']; // 自定义颜色数组
//           return colors[params.dataIndex]; // 根据柱子的索引选择不同的颜色
//         },
//       },
//       barWidth: 30, // 设置柱子的宽度
//     },
//     {
//       name: 'Cumulative Time',
//       type: 'line',
//       data: [null, 10.809886404, 10.809886404 + 10.425607666, 10.809886404 + 10.425607666 + 11.814508779], // 阶梯图数据
//       itemStyle: {
//         color: '#4F9CBA', // 设置折线颜色为蓝色
//       },
//       lineStyle: {
//         type: 'solid', // 线性
//         width: 2,
//       },
//       areaStyle: {
//         color: 'rgba(79, 156, 186, 0.2)', // 设置区域颜色为透明蓝色，提升协调感
//       },
//       symbol: 'circle', // 圆形符号
//       symbolSize: 6, // 设置符号大小
//     },
//   ],
//   backgroundColor: 'white', // 设置图表的背景颜色为白色
//   grid: {
//     left: '10%',
//     right: '10%',
//     bottom: '10%',
//     top: '15%', // 调整上方的间距，使得标题更合适
//   },
// });



});




</script>

<style scoped>
#json-editor {
  height: 350px;
}
</style>
