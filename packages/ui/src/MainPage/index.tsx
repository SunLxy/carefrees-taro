/**
 * 查询页面样式
 */
import { Fragment } from 'react';
import { View, ViewProps } from '@tarojs/components';

export interface MainPageProps extends ViewProps {
  /**查询表单部分*/
  search?: React.ReactNode;
  searchClassName?: string;
  searchStyle?: ViewProps['style'];
  /**底部内容*/
  footer?: React.ReactNode;
  footerClassName?: string;
  footerStyle?: ViewProps['style'];

  /**内容区域*/
  bodyClassName?: string;
  bodyStyle?: ViewProps['style'];
}

export const MainPage = (props: MainPageProps) => {
  const {
    children,
    search,
    footer,
    className = '',
    searchClassName = '',
    footerClassName = '',
    bodyClassName = '',
    bodyStyle,
    footerStyle,
    searchStyle,
    ...rest
  } = props;

  return (
    <View {...rest} className={`carefrees_ui-taro-mian-page ${className}`}>
      {search ? (
        <View style={searchStyle} className={`carefrees_ui-taro-mian-page_search ${searchClassName}`}>
          {search}
        </View>
      ) : (
        <Fragment />
      )}
      <View style={bodyStyle} className={`carefrees_ui-taro-mian-page_body ${bodyClassName}`}>
        {children}
      </View>
      {footer ? (
        <View style={footerStyle} className={`carefrees_ui-taro-mian-page_footer ${footerClassName}`}>
          {footer}
        </View>
      ) : (
        <Fragment />
      )}
    </View>
  );
};

export default MainPage;
