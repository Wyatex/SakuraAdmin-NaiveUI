import type { PageParams } from '@/components/common/s-table';
import { request } from '../../request';

const perfix = '/sysAuth';

/**
 * 权限列表
 */
export function list(param?: PageParams & Partial<SysApi.Auth>) {
  return request.post<SysApi.Auth[]>(`${perfix}/list`, param);
}

/**
 * 添加权限
 */
export function add(param: Partial<SysApi.Auth>) {
  return request.post<SysApi.Auth[]>(`${perfix}/add`, param);
}

/**
 * 删除权限
 */
export function del(param: Partial<SysApi.Auth>) {
  return request.post<SysApi.Auth[]>(`${perfix}/del`, param);
}

/**
 * 修改权限
 */
export function edit(param: Partial<SysApi.Auth>) {
  return request.post<SysApi.Auth[]>(`${perfix}/edit`, param);
}
