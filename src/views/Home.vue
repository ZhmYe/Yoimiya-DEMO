<template>
  <div class="Container">
    <a-card title="ZK Test" :bordered="true" class="Card" :hoverable="true">
      <div class="Form">
        <a-row :gutter="16" class="Form">
          <a-col :span="24">
            <a-row>
              <a-col :span="24">
                <a-row align="middle">
                  <a-col :span="4">
                    <label>Num Iter</label>
                  </a-col>
                  <a-col :span="20">
                    <a-input v-model:value="formState.numIter" />
                  </a-col>
                </a-row>
              </a-col>
            </a-row>

            <a-row style="margin-top: 70px;">
              <a-col :span="11">
                <a-row align="middle">
                  <a-col :span="9">
                    <label>Input1</label>
                  </a-col>
                  <a-col :span="15">
                    <a-input v-model:value="formState.input1" />
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="11" offset="2">
                <a-row align="middle">
                  <a-col :span="9">
                    <label>Input2</label>
                  </a-col>
                  <a-col :span="15">
                    <a-input v-model:value="formState.input2" />
                  </a-col>
                </a-row>
              </a-col>
            </a-row>

            <a-row style="margin-top: 70px;">
              <a-col :span="24">
                <a-row align="middle">
                  <a-col :span="4">
                    <label>Num Partition</label>
                  </a-col>
                  <a-col :span="20">
                    <a-input v-model:value="formState.numPartition" />
                  </a-col>
                </a-row>
              </a-col>
            </a-row>

            <a-row style="margin-top: 60px;">
              <a-col :span="10" :offset="7">
                <a-button type="primary" @click="onFinish"
                  style="width: 100%; height: 100px; background-color: rgb(94,50,139);">Submit</a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface FormState {
  numIter: string;
  input1: string;
  input2: string;
  numPartition: string;
}

const formState = reactive<FormState>({
  numIter: '',
  input1: '',
  input2: '',
  numPartition: ''
});
const onFinish = (values: any) => {
  console.log('Success:', values);
  // 跳转到 /information 路由，并传递 formState 作为查询参数
  router.push({
    path: '/information',
    query: { ...formState }
  });
};

</script>

<style scoped>
.Container {
  width: 100%;
  height: 100%;
}

.Card {
  width: 1000px;
  height: 900px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.Card * {
  font-size: 25px;
}

.Form {
  margin-top: 160px;
}
</style>