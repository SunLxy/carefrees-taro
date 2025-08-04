import { Fragment, useMemo } from 'react';
import { View, ViewProps } from '@tarojs/components';
import clx from 'classnames';

export interface LayoutProps extends ViewProps {
  mode?: 'top' | 'left' | 'between' | 'evenly';
  title?: React.ReactNode;
}

export const Layout = (props: LayoutProps) => {
  const { mode = 'left', children, title, ...rest } = props;

  const cls = useMemo(() => {
    return clx('carefrees_ui-taro-layout', { [mode]: true });
  }, [mode]);

  return (
    <View {...rest} className={cls}>
      {title ? <View className="carefrees_ui-taro-layout_title">{title}</View> : <Fragment />}
      <View className="carefrees_ui-taro-layout_body">{children}</View>
    </View>
  );
};

export default Layout;
