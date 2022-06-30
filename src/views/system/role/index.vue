<template>
	<div class="flex w-full">
		<n-card class="shadow-sm rounded-16px h-full flex-1">
			<n-grid class="mb-4" cols="2 m:3 xl:4" responsive="screen" :x-gap="10">
				<n-grid-item>
					<n-form-item label="角色名" label-placement="left">
						<n-input v-model:value="queryParam.roleName" placeholder="输入角色名" clearable />
					</n-form-item>
				</n-grid-item>
				<n-grid-item span="2">
					<n-button type="primary" @click="table?.reload">
						<template #icon>
							<Icon icon="tabler:search" />
						</template>
						查询
					</n-button>
					<n-button class="ml-4" @click="form?.addForm">
						<template #icon>
							<Icon icon="tabler:new-section" />
						</template>
						添加
					</n-button>
				</n-grid-item>
			</n-grid>
			<s-table ref="table" pagination="self" action-type="rightClick" :actions="actions" :columns="columns"
				:request="request" />
			<role-form ref="form" @ok="table?.reload()" />
		</n-card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { Icon } from '@iconify/vue';
import {
	type ActionItem,
	type PageResult,
	type PageParams,
	STable,
	type STableType
} from '@/components/common/s-table';
import { page, del } from '@/service/api/system/role';
import RoleForm from './roleForm.vue'

const table = ref<STableType>();
const form = ref<InstanceType<typeof RoleForm>>();
const queryParam = ref<any>({
	roleName: '',
	defaultRouter: '',
	remark: '',
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
		title: '修改',
		handler: row => {
			form.value?.editForm(row)
		}
	},
	{
		title: '删除',
		handler: row => {
			window.$dialog?.warning({
        title: '警告',
        content: '是否删除该角色？',
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
			form.value?.editForm(row)
		}
	}
];

const columns: DataTableColumns<SysApi.User> = [
	{
		key: 'roleName',
		title: '角色名'
	},
	{
		key: 'remark',
		title: '备注'
	},
];

onMounted(async () => {
	table.value?.reload();
});
</script>
<style scoped>
.n-card {
	width: unset;
}
</style>
