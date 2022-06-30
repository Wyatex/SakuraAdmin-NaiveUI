<template>
  <n-card class="shadow-sm rounded-16px h-full flex-1">
    <n-grid class="mb-4" cols="2 m:3 xl:4" responsive="screen" :x-gap="10">
      <n-grid-item>
        <n-form-item label="部门名称" label-placement="left">
          <n-input v-model:value="queryParam.name" placeholder="输入部门名称" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="2">
        <div>
          <n-button type="primary" @click="table?.reload">
            <template #icon>
              <Icon icon="tabler:search" />
            </template>
            查询
          </n-button>
          <n-button class="ml-4" @click="form?.addForm()">
            <template #icon>
              <Icon icon="tabler:new-section" />
            </template>
            添加
          </n-button>
        </div>
      </n-grid-item>
    </n-grid>
    <s-table ref="table" action-type="rightClick" :actions="actions" :columns="columns" :request="request" />
    <dept-form ref="form" @ok="table?.reload()" />
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { type PageResult, STable, type ActionItem, type STableType } from '@/components/common/s-table';
import { list, del } from '@/service/api/system/dept';
import DeptForm from './deptForm.vue';

const table = ref<STableType>();
const form = ref<InstanceType<typeof DeptForm>>();
const queryParam = ref<any>({
  name: ''
});
const request = async (): Promise<Partial<PageResult<unknown>>> => {
  const res = await list(queryParam.value);
  if (!res.error) {
    return {
      rows: res.data
    };
  }
  return {
    rows: []
  };
};

const actions: ActionItem[] = [
	{
		title: '添加',
		handler: row => {
			form.value?.addForm(row.id as number);
		}
	},
  {
    title: '修改',
    handler: row => {
      form.value?.editForm(row);
    }
  },
  {
    title: '删除',
    handler: row => {
      window.$dialog?.warning({
        title: '警告',
        content: '是否删除该部门？',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
          const res = await del({ id: row.id as number });
          if (res.error === null) {
            window.$message?.success('删除成功');
            table.value?.reload();
          }
        }
      });
    }
  }
];

const columns: DataTableColumns<SysApi.User> = [
  {
    key: 'deptName',
    title: '部门名称'
  },
  {
    key: 'remark',
    title: '描述'
  },
  {
    key: 'status',
    title: '状态',
    render: (row: any) =>
      h(NTag, { type: row.status === 1 ? 'info' : 'error' }, () => h('span', row.status === 1 ? '启用' : '禁用'))
  }
];

onMounted(async () => {
  table.value?.reload();
});
</script>
