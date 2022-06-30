import { computed, ref, h, Ref } from 'vue';
import { DataTableColumns, PaginationProps } from 'naive-ui';
import type { RowKey } from 'naive-ui/lib/data-table/src/interface';
import ActionColumn from './actionColumn.vue';
import { paginationSetting } from './setting';
import { ActionItem } from './types';

export default function useDataTable(
  pagination: false | Ref<PaginationProps> | 'self',
  showCheck: boolean,
  columns: DataTableColumns<any>,
  actionType: 'rightClick' | 'actionColumn' | 'all' | 'none',
  actions: ActionItem[]
) {
  // 勾选中的行
  const checkRows = ref<RowKey[]>();

  const handleCheck = (rowKeys: RowKey[]) => {
    checkRows.value = rowKeys;
  };

  // 分页配置
  const insPagination = ref<any>();
  const getPagination = computed(() => {
    if (pagination === false) {
      return false;
    }
    if (pagination === 'self') {
      const pageSizes = paginationSetting.pageSizes.map(item => item);
      const { defaultPageSize } = paginationSetting;
      insPagination.value = { page: 1, pageSize: defaultPageSize, showSizePicker: true, pageSizes };
      return insPagination.value;
    }
    if (pagination) {
      return pagination;
    }
    return false;
  }) as any;

  // 表头配置
  const insColumns = computed(() => {
    let cloumns = [];
    // 是否加上勾选栏
    if (showCheck) {
      cloumns.push({ type: 'selection' });
    }
    cloumns = [...cloumns, ...columns];
    // 是否加上操作栏
    if (['actionColumn', 'all'].includes(actionType)) {
      cloumns = [
        ...cloumns,
        {
          title: '操作栏',
          render: (row: Common.Recordable) => {
            return h(ActionColumn, { row, actions });
          }
        }
      ];
    }
    return cloumns;
  }) as any;

  return { insPagination, getPagination, insColumns, checkRows, handleCheck };
}
