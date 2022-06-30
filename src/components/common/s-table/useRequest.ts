/* eslint-disable no-param-reassign */
import { ref, type Ref } from 'vue';
import type { PaginationInfo } from 'naive-ui';
import type { RowData } from 'naive-ui/lib/data-table/src/interface';
import { paginationSetting } from './setting';
import type { PageParams, PageResult } from './types';

export default function useRequest(
  request: (pageParams?: PageParams) => Promise<Partial<PageResult<any>>>,
  pagination: false | Ref<PaginationInfo> | undefined
) {
  // 表格数据
  const dataSource = ref<RowData[]>();

  // 加载中
  const loading = ref(false);

  // 请求
  const reload = async () => {
    loading.value = true;
    if (pagination && pagination.value) {
      const pageParam: PageParams = {
        [paginationSetting.pageField]: pagination.value.page || 1,
        [paginationSetting.sizeField]: pagination.value.pageSize || paginationSetting.defaultPageSize
      };
      const res = await request(pageParam);
      if (!res) {
        dataSource.value = [];
        pagination.value.page = pagination.value.page || 1;
        pagination.value.pageSize = pagination.value.pageSize || paginationSetting.defaultPageSize;
        pagination.value.pageCount = 0;
        loading.value = false;
        return;
      }
      dataSource.value = res[paginationSetting.listField] || [];
      pagination.value.page = res[paginationSetting.pageField] || 0;
      pagination.value.pageSize = res[paginationSetting.sizeField] || 10;
      pagination.value.pageCount = res[paginationSetting.totalField] || 1;
      loading.value = false;
      return;
    }
    const res = await request();
    if (!res) {
      dataSource.value = [];
      loading.value = false;
      return;
    }
    dataSource.value = res[paginationSetting.listField];
    loading.value = false;
  };

  return { dataSource, loading, reload };
}
