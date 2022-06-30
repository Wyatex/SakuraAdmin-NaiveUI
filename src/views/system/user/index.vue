<template>
  <div class="flex w-full">
    <n-card title="部门架构" class="h-full shadow-sm rounded-16px mr-16px">
      <template #header>
        <span class="text-18px">
          部门架构
          <n-tooltip trigger="hover">
            <template #trigger>
              <icon-tabler-info-circle class="text-18px" />
            </template>
            点击部门查看对应的部门用户，再次点击取消选择部门
          </n-tooltip>
        </span>
      </template>
      <n-tree block-line :data="data" selectable default-expand-all @update:selected-keys="selectDept" />
    </n-card>
    <n-card class="shadow-sm rounded-16px h-full flex-1">
      <n-grid class="mb-4" cols="2 m:3 xl:4" responsive="screen" :x-gap="10">
        <n-grid-item>
          <n-form-item label="账号" label-placement="left">
            <n-input v-model:value="queryParam.username" placeholder="输入姓名" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item label="昵称" label-placement="left">
            <n-input v-model:value="queryParam.nickname" placeholder="输入昵称" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item label="手机号" label-placement="left">
            <n-input v-model:value="queryParam.phone" placeholder="输入姓名" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item label="邮箱" label-placement="left">
            <n-input v-model:value="queryParam.email" placeholder="输入姓名" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          <n-button type="primary" @click="table?.reload">
            <template #icon>
              <Icon icon="tabler:search" />
            </template>
            查询
          </n-button>
          <n-button class="ml-4" @click="table?.reload">
            <template #icon>
              <Icon icon="tabler:new-section" />
            </template>
            添加
          </n-button>
        </n-grid-item>
      </n-grid>
      <s-table
        ref="table"
        pagination="self"
        action-type="rightClick"
        :actions="actions"
        :columns="columns"
        :request="request"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NTag } from 'naive-ui';
import { Icon } from '@iconify/vue';
import {
  type ActionItem,
  type PageResult,
  type PageParams,
  STable,
  type STableType
} from '@/components/common/s-table';
import { list } from '@/service/api/system/dept';
import { page } from '@/service/api/system/user';

const table = ref<STableType>();
const queryParam = ref<any>({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  deptId: null
});
const request = async (pageParams?: PageParams | undefined): Promise<PageResult<any>> => {
  const res = await page({
    ...queryParam.value,
    ...pageParams
  });
  if (!res.error) {
    return res.data;
  }
  return {
    pageNo: queryParam.value.pageNo,
    pageSize: queryParam.value.pageSize,
    pageTotal: 0,
    rows: []
  };
};

const actions: ActionItem[] = [
  {
    title: 'test',
    handler: row => {
      console.log(row);
    }
  }
];

const sexMap: { [k: number]: string } = {
  0: '保密',
  1: '男',
  2: '女'
};

const columns: DataTableColumns<SysApi.User> = [
  {
    key: 'id',
    title: 'uid'
  },
  {
    key: 'username',
    title: '账号'
  },
  {
    key: 'nickname',
    title: '昵称'
  },
  {
    key: 'phone',
    title: '手机号'
  },
  {
    key: 'email',
    title: '邮箱'
  },
  {
    key: 'status',
    title: '状态',
    render: (row: any) =>
      h(NTag, { type: row.status === 1 ? 'info' : 'error' }, () => h('span', row.status === 1 ? '启用' : '禁用'))
  },
  {
    key: 'sex',
    title: '性别',
    render: (row: any) => h('span', sexMap[row.sex])
  },
  {
    key: 'remark',
    title: '描述'
  }
];
const data = ref([]) as any;

// 递归修改属性
function recursiveTree(node: any): any {
  if (node.children && node.children.length > 0) {
    node.children.forEach((item: any) => {
      recursiveTree(item);
    });
  }
  node.key = node.id;
  node.label = node.deptName;
}

const selectDept = (key: number[]) => {
  if (key && key.length > 0) {
    const [deptId] = key;
    queryParam.value.deptId = deptId;
  } else {
    queryParam.value.deptId = null;
  }
  table.value?.reload();
};

onMounted(async () => {
  const dept = await list();
  data.value = dept.data?.map(item => {
    const val: any = {};
    if (item.children && item.children.length > 0) {
      recursiveTree(item);
      val.children = item.children;
    }
    val.key = item.id;
    val.label = item.deptName;
    return val;
  });
  table.value?.reload();
});
</script>
<style scoped>
.n-card {
  width: unset;
}
</style>
