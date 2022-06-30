import { mockRequest, request } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 登录
 * @param username - 用户名
 * @param password - 密码
 */
export async function fetchLogin(username: string, password: string) {
	// 这里先用mock的路由
	const mockRouter = await mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId: 0 });
	const res = await request.post<ApiAuth.LoginData>('/login', { username, password });
	res.data?.route.routes.push(...(mockRouter.data?.routes as AuthRoute.Route[]))
  return res
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return mockRequest.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export async function fetchUserRoutes() {
	// 这里先用mock的路由
	const mockRouter = await mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId: 0 });
  const apiRouter = await request.post<ApiRoute.Route>('/sysAuth/getRoute');
	apiRouter.data?.routes.push(...(mockRouter.data?.routes as AuthRoute.Route[]))
	return apiRouter
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return mockRequest.post<ApiAuth.Token>('/updateToken', { refreshToken });
}
