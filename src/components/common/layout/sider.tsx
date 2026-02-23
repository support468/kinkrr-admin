import { Layout, Switch } from 'antd';
import getConfig from 'next/config';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import { SiderMenu } from './menu';
import style from './sider.module.scss';

const { publicRuntimeConfig: config } = getConfig();

interface ISiderProps {
  collapsed: boolean;
  menus: any;
  logo: string;
  siteName: string;
}

function Sider({
  collapsed, menus, logo, siteName
}: ISiderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Layout.Sider
      width={256}
      theme={theme as any}
      breakpoint="lg"
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={classnames(style.sider, { [style.collapsed]: collapsed })}
    >
      <div className={style.brand}>
        <Link href="/">
          {logo ? (
            <Image
              alt="logo"
              width={150}
              height={150}
              quality={70}
              priority
              sizes="(max-width: 768px) 50vw, (max-width: 2100px) 15vw"
              src={logo}
            />
          ) : siteName}
        </Link>
      </div>
      <div className={style.menu_container}>
        <SiderMenu
          menus={menus}
          theme={theme}
          isMobile={isMobile}
          collapsed={collapsed}
        />
      </div>
      <div className={style.switch_theme}>
        <span>
          v
          {config.BUILD_VERSION}
        </span>
        {!collapsed && (
          <Switch
            onChange={() => (setTheme(theme === 'dark' ? 'light' : 'dark'))}
            checked={theme === 'dark'}
            defaultChecked={false}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        )}
      </div>
    </Layout.Sider>
  );
}

export default Sider;
