<template>
	<n-modal v-model:show="showModal" class="max-w-1000px min-w-880px" preset="card" :title="modelTitle"
		:mask-closable="false">
		<n-form ref="formRef" :model="formParams" :rules="rules" label-placement="left" :label-width="70" class="py-4">
			<n-grid x-gap="6" cols="24">
				<n-form-item-gi label="权限类型" span="12">
					<n-radio-group v-model:value="formParams.type" name="authType">
						<n-radio-button v-for="type in authTypes" :key="type.value" :value="type.value" :label="type.label" />
					</n-radio-group>
				</n-form-item-gi>
				<n-form-item-gi label="上级权限" span="12">
					<n-tree-select default-expand-all placeholder="请选择父权限" :default-value="formParams.parentId"
						:options="authTree" clearable @update:value="handleAuthSelect" />
				</n-form-item-gi>
				<template v-if="formParams.type === 0">
					<n-form-item-gi label="目录名称" path="title" span="12">
						<n-input v-model:value="formParams.title" placeholder="请输入目录名称" />
					</n-form-item-gi>
				</template>
				<template v-else-if="formParams.type === 1">
					<n-form-item-gi label="目录名称" path="title" span="12">
						<n-input v-model:value="formParams.title" placeholder="请输入目录名称" />
					</n-form-item-gi>
				</template>
				<template v-else-if="formParams.type === 2">
					<n-form-item-gi label="展示名称" path="title" span="12">
						<n-input v-model:value="formParams.title" placeholder="请输入页面名称" />
					</n-form-item-gi>
					<n-form-item-gi label="页面路由" path="title" span="12">
						<n-input v-model:value="formParams.routePath" placeholder="请输入页面名称" />
					</n-form-item-gi>
					<n-form-item-gi label="页面名称" path="title" span="12">
						<n-input v-model:value="formParams.routeName" placeholder="请输入页面名称（唯一英文）" />
					</n-form-item-gi>
				</template>
				<template v-else-if="formParams.type === 3">
					<n-form-item-gi label="API名称" path="title" span="12">
						<n-input v-model:value="formParams.title" placeholder="请输入API名称" />
					</n-form-item-gi>
					<n-form-item-gi label="API路径" path="title" span="12">
						<n-input v-model:value="formParams.apiPath" placeholder="请输入API路径" />
					</n-form-item-gi>
				</template>
				<template v-else-if="formParams.type === 4">
					<n-form-item-gi label="按钮名称" path="title" span="12">
						<n-input v-model:value="formParams.btnName" placeholder="请输入按钮名称" />
					</n-form-item-gi>
				</template>
				<n-form-item-gi label="菜单隐藏" span="4">
					<n-switch v-model:value="formParams.hidden" :checked-value="1" :unchecked-value="0">
						<template #checked> 隐藏 </template>
						<template #unchecked> 显示 </template>
						<template #checked-icon>
							<n-icon>
								<icon-ph-eye-closed-bold />
							</n-icon>
						</template>
						<template #unchecked-icon>
							<n-icon>
								<icon-ph-eye-bold />
							</n-icon>
						</template>
					</n-switch>
				</n-form-item-gi>
				<n-form-item-gi label="状态" span="4">
					<n-switch v-model:value="formParams.status" :checked-value="1" :unchecked-value="0">
						<template #checked> 开启 </template>
						<template #unchecked> 禁用 </template>
					</n-switch>
				</n-form-item-gi>
				<n-form-item-gi span="4" label="排序">
					<n-input-number v-model:value="formParams.sort" />
				</n-form-item-gi>
			</n-grid>
		</n-form>
		<template #action>
			<n-space justify="end">
				<n-button @click="() => (showModal = false)">取消</n-button>
				<n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定 </n-button>
			</n-space>
		</template>
	</n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage, type NForm } from 'naive-ui';
import { list, edit, add } from '@/service/api/system/auth';

const message = useMessage();
const formRef = ref<InstanceType<typeof NForm>>();
const modelTitle = ref('');
const showModal = ref(false);
const formBtnLoading = ref(false);
const authTree = ref<any>();

const emit = defineEmits<{
	(event: 'ok'): void;
}>();

// 表单项
const formParams = ref({
	parentId: 0,
	type: -1,
	title: '',
	status: 1,
	routePath: '',
	routeName: '',
	apiPath: '',
	btnName: '',
	icon: '',
	sort: 0,
	hidden: 0,
});

// 表单校验
const rules = {
	title: {
		required: true,
		trigger: ['blur', 'input'],
		message: '请输入权限名称'
	}
};

const authTypes = [
	{
		value: 0,
		label: '目录'
	},
	{
		value: 1,
		label: '中间目录'
	},
	{
		value: 2,
		label: '页面'
	},
	{
		value: 3,
		label: 'API'
	},
	{
		value: 4,
		label: '按钮'
	},
]

// 接收父菜单选择
const handleAuthSelect = (key: number) => {
	formParams.value.parentId = key;
};

// 加载权限
function recursiveTree(node: any): any {
	if (node.children && node.children.length > 0) {
		node.children.forEach((item: any) => {
			recursiveTree(item);
		});
	} else {
		node.children = null
	}
	node.key = node.id;
	node.label = node.title;
}

// 重写加载权限列表
const reloadAuth = async () => {
	const auth = await list();
	authTree.value = auth.data?.map(item => {
		const val: any = {};
		if (item.children && item.children.length > 0) {
			recursiveTree(item);
			val.children = item.children;
		} else {
			item.children = undefined
		}
		val.key = item.id;
		val.label = item.title;
		return val;
	});
};

// 打开添加弹窗
const addForm = (parentId?: number) => {
	reloadAuth();
	formParams.value = {
		parentId: parentId || 0,
		type: -1,
		title: '',
		status: 1,
		routePath: '',
		routeName: '',
		apiPath: '',
		btnName: '',
		icon: '',
		sort: 0,
		hidden: 0,
	};
	modelTitle.value = '添加权限';
	showModal.value = true;
};

// 打开修改弹窗
const editForm = (record: any) => {
	reloadAuth();
	formParams.value = { ...record };
	modelTitle.value = '修改权限';
	showModal.value = true;
};

// 确认提交
const confirmForm = () => {
	formBtnLoading.value = true;
	formRef.value?.validate(async err => {
		if (err) {
			message.error('请检查表单数据是否正确');
			formBtnLoading.value = false;
		} else if (modelTitle.value === '添加权限') {
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

onMounted(reloadAuth);

defineExpose({
	addForm,
	editForm
});
</script>
