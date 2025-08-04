import React, { Fragment, useMemo } from 'react';
import { View, ViewProps } from '@tarojs/components';
import clx from 'classnames';

interface CardProps extends ViewProps {
  /**阴影*/
  boxShadow?: boolean;
  /**边框*/
  bordered?: boolean;

  /**标题*/
  title?: React.ReactNode;
  /**额外内容*/
  extra?: React.ReactNode;
  /**底部内容*/
  footer?: React.ReactNode;

  headerClassName?: string;
  titleClassName?: string;
  extraClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  headerStyle?: ViewProps['style'];
  titleStyle?: ViewProps['style'];
  extraStyle?: ViewProps['style'];
  bodyStyle?: ViewProps['style'];
  footerStyle?: ViewProps['style'];

  /**标题和底部的分割线是否左右靠边*/
  isLineZero?: boolean;
}

export const Card = React.forwardRef((props: CardProps, ref: React.LegacyRef<any>) => {
  const {
    className = '',
    children,
    boxShadow = true,
    bordered = false,
    title,
    extra,
    footer,
    headerClassName = '',
    titleClassName = '',
    extraClassName = '',
    footerClassName = '',
    bodyClassName = '',
    headerStyle,
    titleStyle,
    extraStyle,
    footerStyle,
    bodyStyle,
    isLineZero,
    ...rest
  } = props;

  const cls = useMemo(() => {
    return clx({ bordered, boxShadow, 'is-line-zero': isLineZero });
  }, [boxShadow, bordered, isLineZero]);

  return (
    <View {...rest} ref={ref} className={`carefrees_ui-taro-card ${cls} ${className}`}>
      {title || extra ? (
        <View className={`carefrees_ui-taro-card-header ${headerClassName}`} style={headerStyle}>
          <View className={`carefrees_ui-taro-card-header-title ${titleClassName}`} style={titleStyle}>
            {title}
          </View>
          <View className={`carefrees_ui-taro-card-header-extra ${extraClassName}`} style={extraStyle}>
            {extra}
          </View>
        </View>
      ) : (
        <Fragment />
      )}
      <View className={`carefrees_ui-taro-card-body ${bodyClassName}`} style={bodyStyle}>
        {children}
      </View>
      {footer ? (
        <View className={`carefrees_ui-taro-card-footer ${footerClassName}`} style={footerStyle}>
          {footer}
        </View>
      ) : (
        <Fragment />
      )}
    </View>
  );
});
export default Card;
