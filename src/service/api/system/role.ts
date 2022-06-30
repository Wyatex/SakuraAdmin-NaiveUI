import type { PageParams, PageResult  } from '@/components/common/s-table';
import { request } from '../../request';

const perfix = '/sysRole';

/**
 * 角色列表
 */
export function list(param?: PageParams & Partial<SysApi.Role>) {
  return request.post<SysApi.Role[]>(`${perfix}/list`, param);
}

/**
 * 角色分页查询
 */
export function page(param: PageParams & Partial<SysApi.User>) {
  return request.post<PageResult<SysApi.User>>(`${perfix}/page`, param);
}


/**
 * 添加角色
 */
export function add(param: Partial<SysApi.Role>) {
  return request.post<SysApi.Role[]>(`${perfix}/add`, param);
}

/**
 * 删除角色
 */
export function del(param: Partial<SysApi.Role>) {
  return request.post<SysApi.Role[]>(`${perfix}/del`, param);
}

/**
 * 修改角色
 */
export function edit(param: Partial<SysApi.Role>) {
  return request.post<SysApi.Role[]>(`${perfix}/edit`, param);
}
