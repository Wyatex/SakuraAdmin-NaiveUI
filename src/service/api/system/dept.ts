import type { PageParams } from '@/components/common/s-table';
import { request } from '../../request';

const perfix = '/sysDept';

/**
 * 部门列表
 */
export function list(param?: PageParams & Partial<SysApi.Dept>) {
  return request.post<SysApi.Dept[]>(`${perfix}/list`, param);
}

/**
 * 添加部门
 */
export function add(param: Partial<SysApi.Dept>) {
  return request.post<SysApi.Dept[]>(`${perfix}/add`, param);
}

/**
 * 删除部门
 */
export function del(param: Partial<SysApi.Dept>) {
  return request.post<SysApi.Dept[]>(`${perfix}/del`, param);
}

/**
 * 修改部门
 */
export function edit(param: Partial<SysApi.Dept>) {
  return request.post<SysApi.Dept[]>(`${perfix}/edit`, param);
}
