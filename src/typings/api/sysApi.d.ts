declare namespace SysApi {
  type User = {
    id: number;
    username: string;
    nickname: string;
    phone: string;
    address: string;
    email: string;
    avatar: string;
    sex: number;
    deptId: number;
    remark: number;
  };

  type Dept = {
    id: number;
    parentId: number;
    deptName: string;
    children?: Dept[];
  };

	type Role = {
		id: number;
		roleName: string;
		defaultRouter: number;
    remark: string;
	}

	type Auth = {
		id: number;
		parentId: number;
		type: number;
		title: string;
		routePath: string;
		routeName: string;
		apiPath: string;
		btnName: string;
		icon: string;
		sort: number;
		hidden: number;
		status: number;
		children?: Auth[];
	}
}
