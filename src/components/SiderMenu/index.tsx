import DrawerMenu from 'rc-drawer-menu';
import 'rc-drawer-menu/assets/index.css';
import React from 'react';
import SiderMenu from './SiderMenu';

interface Props {
  onCollapse: (falg) => void;
  onOpenChange: (openKeys) => void;
  isMobile: boolean;
  collapsed: boolean;
  selectedKeys: string[];
  openKeys: string[];
  logo: any;
}

export default (props: Props) => (
  props.isMobile ? (
    <DrawerMenu
      parent={null}
      level={null}
      iconChild={null}
      open={!props.collapsed}
      onMaskClick={() => { props.onCollapse(true); }}
      width="256px"
    >
      <SiderMenu  {...props} collapsed={props.isMobile ? false : props.collapsed} />
    </DrawerMenu>
  )
  : <SiderMenu  {...props} />
);
