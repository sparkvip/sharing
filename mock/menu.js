const menus = [
  // {
  //   id: 1,
  //   path: '/dashboard',
  //   name: '资源推荐',
  //   icon: 'dashboard',
  //   parentId: 0,
  // },
  {
    id: 101,
    path: '/dashboard/analysis',
    name: '资源推荐',
    icon: 'dashboard',
    parentId: 0,
  },
  // {
  //   id: 2,
  //   path: '/search',
  //   name: '分类搜索',
  //   icon: 'menu-unfold',
  //   parentId: 0,
  // },
  {
    id: 201,
    path: '/search/categorylist',
    name: '分类搜索',
    icon: 'zoom-in',
    parentId: 0,
  },
  {
    id: 3,
    path: '/upload',
    name: '资源上传',
    icon: 'cloud-upload',
    parentId: 0,
  },
  {
    id: 301,
    path: '/upload/submit',
    name: '上传资源',
    icon: 'cloud-upload',
    parentId: 3,
  },
  {
    id: 302,
    path: '/upload/query',
    name: '资源查看',
    icon: 'menu-unfold',
    parentId: 3,
  },
  {
    id: 401,
    path: '/account/settings/base',
    name: '个人设置',
    icon: 'team',
    parentId: 0,
  },
  {
    id: 501,
    path: '/aduit/queried',
    name: '资源审批',
    icon: 'form',
    parentId: 0,
  },
  {
    id: 6,
    path: '/friend',
    name: '好友管理',
    icon: 'form',
    parentId: 0,
  },
  {
    id: 601,
    path: '/friend/add',
    name: '添加好友',
    icon: 'form',
    parentId: 6,
  },
  {
    id: 602,
    path: '/friend/query',
    name: '查看好友',
    icon: 'form',
    parentId: 6,
  },
  
];

export default {
  'GET /api/project/menus': menus,
};
