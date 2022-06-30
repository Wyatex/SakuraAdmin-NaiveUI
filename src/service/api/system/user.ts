import type { PageParams, PageResult } from '@/components/common/s-table';
import { request } from '../../request';

const perfix = '/sysUser';

/**
 * 用户列表
 */
export function list(param: Partial<SysApi.User>) {
  return request.post<SysApi.User>(`${perfix}/list`, param);
}

/**
 * 用户分页查询
 */
export function page(param: PageParams & Partial<SysApi.User>) {
  return request.post<PageResult<SysApi.User>>(`${perfix}/page`, param);
}
