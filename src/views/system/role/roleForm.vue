<template>
	<n-modal v-model:show="showModal" preset="dialog" :title="modelTitle" :mask-closable="false">
		<n-form ref="formRef" :model="formParams" :rules="rules" label-placement="left" :label-width="120" class="py-4">
			<n-form-item label="角色名称" path="roleName">
				<n-input v-model:value="formParams.roleName" placeholder="请输入部门名称" />
			</n-form-item>
			<n-form-item label="默认首页">
				<n-tree-select default-expand-all :default-value="formParams.defaultRouter" :options="authTree" placeholder="请选择默认首页" clearable
					@update:value="handleAuthSelect"></n-tree-select>
			</n-form-item>
			<n-form-item label="描述">
				<n-input v-model:value="formParams.remark" maxlength="255" show-count type="textarea" placeholder="请输入部门描述" />
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
import { list } from '@/service/api/system/auth';
import { edit, add } from '@/service/api/system/role'

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
	roleName: '',
	defaultRouter: 0,
	remark: ''
});

// 表单校验
const rules = {
	roleName: {
		required: true,
		trigger: ['blur', 'input'],
		message: '请输入角色名称'
	}
};

// 接收父权限选择
const handleAuthSelect = (key: number) => {
	formParams.value.defaultRouter = key;
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
const addForm = () => {
	reloadAuth();
	formParams.value = {
		roleName: '',
		defaultRouter: 0,
		remark: ''
	};
	modelTitle.value = '添加角色';
	showModal.value = true;
};

// 打开修改弹窗
const editForm = (record: any) => {
	reloadAuth();
	formParams.value = { ...record };
	modelTitle.value = '修改角色';
	showModal.value = true;
};

// 确认提交
const confirmForm = () => {
	formBtnLoading.value = true;
	formRef.value?.validate(async err => {
		if (err) {
			message.error('请检查表单数据是否正确');
			formBtnLoading.value = false;
		} else if (modelTitle.value === '添加角色') {
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
