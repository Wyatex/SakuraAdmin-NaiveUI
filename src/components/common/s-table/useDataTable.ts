import { computed, ref, h, type Ref } from 'vue';
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
  let insPagination = false as false | Ref<PaginationProps>;
  if (pagination === false) {
    insPagination = false;
  } else if (pagination === 'self') {
    const pageSizes = paginationSetting.pageSizes.map(item => item);
    const { defaultPageSize } = paginationSetting;
    insPagination = ref<PaginationProps>({
      page: 1,
      pageSize: defaultPageSize,
      showSizePicker: true,
      showQuickJumper: true,
      pageSizes
    });
  } else if (pagination) {
    insPagination = pagination;
  }

  const paginationComputed = computed(() => {
    if (!insPagination) {
      return insPagination;
    } if (!insPagination.value) {
      return undefined;
    }
    return insPagination.value;
  });

  // 表头配置
  const insColumns = computed(() => {
    let tempColumns: DataTableColumns = [];
    // 是否加上勾选栏
    if (showCheck) {
      tempColumns.push({ type: 'selection' });
    }
    tempColumns = [...tempColumns, ...columns];
    // 是否加上操作栏
    if (['actionColumn', 'all'].includes(actionType)) {
      tempColumns = [
        ...tempColumns,
        {
          title: '操作栏',
          key: 'actionColumn',
          render: row => {
            return h(ActionColumn, { row, actions });
          }
        }
      ];
    }
    return tempColumns;
  });

  return { insPagination, paginationComputed, insColumns, checkRows, handleCheck };
}
