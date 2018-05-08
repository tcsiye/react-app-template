export default interface MenuBean {
  name: string;
  icon?: string;
  path?: string;
  key?: string;
  type?: MenuType;
  authority?: any;
  hideInMenu?: boolean;
  children?: MenuBean[];
}
export enum MenuType {
    SubMenu = 'SubMenu',
    ItemGroup = 'ItemGroup',
    Item = 'Item'
}
