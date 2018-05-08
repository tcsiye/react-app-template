import MenuBean, { MenuType } from 'src/common/MenuBean';
import { isUrl } from 'src/utils/utils';

const menuData: MenuBean[] = [
  {
    name: '车辆管理',
    path: 'car',
    type: MenuType.SubMenu,
    icon: 'car',
    children: [
      {
        name: '车辆列表',
        path: '/car/list',
        type: MenuType.Item
      },
      {
        name: '车库型管理',
        path: '/car/carModels',
        type: MenuType.Item
      }
    ]
  },
  {
    name: '运营管理',
    path: 'operate',
    type: MenuType.SubMenu,
    icon: 'customer-service',
    children: [
      {
        name: '首页配置',
        type: MenuType.ItemGroup,
        children: [
          {
            name: '底部icon',
            path: '/homeConfig/iconTab',
            type: MenuType.Item
          },
          {
            name: '启动页',
            path: '/homeConfig/appLaunch',
            type: MenuType.Item
          },
          {
            name: '首页新增模块',
            path: '/homeConfig/addModule',
            type: MenuType.Item
          },
          {
            name: 'banner管理',
            path: '/homeConfig/banner',
            type: MenuType.Item
          },
          {
            name: '导航管理',
            path: '/homeConfig/nav',
            type: MenuType.Item
          },
          {
            name: '导购管理',
            path: '/homeConfig/recommend',
            type: MenuType.Item
          }
        ]
      },
      {
        name: '其他',
        type: MenuType.ItemGroup,
        children: [
          {
            name: 'tag管理',
            path: '/tag/tagList',
            type: MenuType.Item
          },
          {
            name: '红包管理',
            path: '/redpack',
            type: MenuType.Item
          },
          {
            name: '热门标签管理',
            path: '/tag/hotTags',
            type: MenuType.Item
          },
          {
            name: '推送管理',
            path: '/push/pushList',
            type: MenuType.Item
          },
          {
            name: '分公司管理',
            path: '/branchCom',
            type: MenuType.Item
          }
        ]
      }
    ]
  },
  {
    name: '订单管理',
    type: MenuType.SubMenu,
    icon: 'solution',
    path: 'order',
    children: [
      {
        name: '订单管理',
        type: MenuType.Item,
        path: '/order',
      }
    ]
  },
  {
    name: '渠道管理',
    type: MenuType.SubMenu,
    path: 'channel',
    icon: 'fork',
    children: [
      {
        name: '渠道管理',
        type: MenuType.Item,
        path: '/channel/chanManage',
      },
      {
        name: '角色管理',
        type: MenuType.Item,
        path: '/channel/role',
      }
    ]
  },
  {
    name: '数据管理',
    type: MenuType.SubMenu,
    path: 'data',
    icon: 'database',
    children: [
      {
        name: '数据导入',
        type: MenuType.Item,
        path: '/data/import',
      },
      {
        name: '数据导出',
        type: MenuType.Item,
        path: '/data/export',
      }
    ]
  },
  {
    name: '合同管理',
    type: MenuType.SubMenu,
    path: 'contract',
    icon: 'idcard',
    children: [
      {
        name: '合同列表',
        type: MenuType.Item,
        path: '/contract/list',
      },
      {
        name: '套件列表',
        type: MenuType.Item,
        path: '/contract/suit',
      }
    ]
  },
  {
    name: 'Entitles',
    type: MenuType.SubMenu,
    path: 'Entitles',
    icon: 'bars'
  },
  {
    name: 'Administration',
    type: MenuType.SubMenu,
    icon: 'team',
    path: 'Administration',
    children: [
      {
        name: '合同管理',
        type: MenuType.Item,
        path: '/user-management/userList',
      }
    ]
  },
  {
    name: '活动管理',
    type: MenuType.SubMenu,
    path: 'activityManage',
    icon: 'bars',
    children: [
      {
        name: '专题管理',
        type: MenuType.Item,
        path: '/activityManage/SpecialManage',
      },
      {
        name: '抽奖管理',
        type: MenuType.Item,
        path: '/activityManage/LuckDrawManage',
      }
    ]
  },
  {
    name: '策略库存管理',
    type: MenuType.SubMenu,
    path: 'strategy',
    icon: 'bars',
    children: [
      {
        name: '策略管理',
        type: MenuType.Item,
        path: '/TacticsManage',
      },
      {
        name: '库存管理',
        type: MenuType.Item,
        path: '/InventoryList',
      }
    ]
  },
];

function formatter(data, parentPath = '/', parentAuthority?) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    };
    if (item.children) {
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority
      );
    }
    return result;
  });
}
export default menuData;
export const getMenuData = () => formatter(menuData);
