/* eslint-disable no-param-reassign */
import { ref, type Ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import type { RowData } from 'naive-ui/lib/data-table/src/interface';
import { paginationSetting } from './setting';
import type { PageParams, PageResult } from './types';

export default function useRequest(
  request: (pageParams?: PageParams) => Promise<Partial<PageResult<any>>>,
  pagination: false | Ref<PaginationProps>
) {
  // 表格数据
  const dataSource = ref<RowData[]>();

  // 加载中
  const loading = ref(false);

  // 请求
  const reload = async () => {
    loading.value = true;
		// 分页查询
    if (pagination && pagination.value) {
      const pageParam: PageParams = {
        [paginationSetting.pageField]: pagination.value.page || 1,
        [paginationSetting.sizeField]: pagination.value.pageSize || paginationSetting.defaultPageSize
      };
      const res = await request(pageParam);
      if (!res) {
        dataSource.value = [];
        pagination.value = {
          ...pagination.value,
          page: pagination.value.page,
          pageSize: pagination.value.pageSize,
          pageCount: 0
        };
        loading.value = false;
        return;
      }
      dataSource.value = res[paginationSetting.listField] || [];
      pagination.value = {
        ...pagination.value,
        page: res[paginationSetting.pageField] || 1,
        pageSize: res[paginationSetting.sizeField] || 10,
        pageCount: res[paginationSetting.totalField] || 1
      };
      loading.value = false;
			return
    }
		// 不分页查询
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
