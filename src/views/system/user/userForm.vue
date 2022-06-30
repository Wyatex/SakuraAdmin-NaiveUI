<template>
  <n-modal v-model:show="showModal" preset="dialog" :title="modelTitle" :mask-closable="false">
    <n-form ref="formRef" :model="formParams" :rules="rules" label-placement="left" :label-width="120" class="py-4">
      <n-form-item label="父部门">
        <n-tree-select
          placeholder="请选择父部门"
          :default-value="formParams.parentId"
          :options="deptTree"
          clearable
          @update:value="handleDeptSelect"
        />
      </n-form-item>
      <n-form-item label="部门名称" path="deptName">
        <n-input v-model:value="formParams.deptName" placeholder="请输入部门名称" />
      </n-form-item>
      <n-form-item label="描述">
        <n-input
          v-model:value="formParams.remark"
          maxlength="255"
          show-count
          type="textarea"
          placeholder="请输入部门描述"
        />
      </n-form-item>
      <n-form-item label="状态">
        <n-switch v-model:value="formParams.status" :checked-value="1" :unchecked-value="0">
          <template #checked> 禁用 </template>
          <template #unchecked> 开启 </template>
        </n-switch>
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定 </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage, type NForm } from 'naive-ui';
import { list, edit, add } from '@/service/api/system/dept';

const message = useMessage();
const formRef = ref<InstanceType<typeof NForm>>();
const modelTitle = ref('');
const showModal = ref(false);
const formBtnLoading = ref(false);
const deptTree = ref<any>();

const emit = defineEmits<{
  (event: 'ok'): void;
}>();

// 表单项
const formParams = ref({
  parentId: 0,
  deptName: '',
  status: 1,
  remark: ''
});

// 表单校验
const rules = {
  deptName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入部门名称'
  }
};

// 接收父部门选择
const handleDeptSelect = (key: number) => {
  formParams.value.parentId = key;
};

// 加载部门
function recursiveTree(node: any): any {
  if (node.children && node.children.length > 0) {
    node.children.forEach((item: any) => {
      recursiveTree(item);
    });
  }
  node.key = node.id;
  node.label = node.deptName;
}

const reloadDept = async () => {
  const dept = await list();
  deptTree.value = dept.data?.map(item => {
    const val: any = {};
    if (item.children && item.children.length > 0) {
      recursiveTree(item);
      val.children = item.children;
    }
    val.key = item.id;
    val.label = item.deptName;
    return val;
  });
};

// 打开添加弹窗
const addForm = () => {
  reloadDept();
  formParams.value = {
    parentId: 0,
    deptName: '',
    status: 1,
    remark: ''
  };
  modelTitle.value = '添加部门';
  showModal.value = true;
};

// 打开修改弹窗
const editForm = (record: any) => {
  reloadDept();
  formParams.value = { ...record };
  modelTitle.value = '修改部门';
  showModal.value = true;
};

// 确认提交
const confirmForm = () => {
  formBtnLoading.value = true;
  formRef.value?.validate(async err => {
    if (err) {
      message.error('请检查表单数据是否正确');
      formBtnLoading.value = false;
    } else if (modelTitle.value === '添加部门') {
      const res = await add(formParams.value);
      if (res.error === null) {
        message.success('添加成功');
        formBtnLoading.value = false;
        showModal.value = false;
        emit('ok');
      } else {
        formBtnLoading.value = false;
      }
    } else {
      const res = await edit(formParams.value);
      if (res.error === null) {
        message.success('修改成功');
        formBtnLoading.value = false;
        showModal.value = false;
        emit('ok');
      } else {
        formBtnLoading.value = false;
      }
    }
  });
};

onMounted(reloadDept);

defineExpose({
  addForm,
  editForm
});
</script>
