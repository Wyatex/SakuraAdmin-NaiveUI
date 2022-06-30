import type { MockMethod } from 'vite-plugin-mock';
import {  routeModel } from '../model';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (): Service.MockServiceResult => {
      const routeHomeName: AuthRoute.RouteKey = 'dashboard_analysis';
      const filterRoutes = routeModel.super;

      return {
        code: 200,
        message: 'ok',
				success: true,
        data: {
          routes: filterRoutes,
          home: routeHomeName
        }
      };
    }
  }
];

export default apis;
