import React from 'react';
import { useProxy } from '@carefrees/taro-utils/esm/valtio';

import { Loading, LoadingProps, Overlay, OverlayProps } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';

const wrapperStyleBase = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};

export interface PageLoadingProps {
  namespace?: string | undefined | null;
  wrapperStyle?: React.CSSProperties;
  overlayProps?: OverlayProps;
  loadingProps?: LoadingProps;
}

export const PageLoading = (props: PageLoadingProps) => {
  const { wrapperStyle, overlayProps, loadingProps } = props;
  const [state] = useProxy(props.namespace);
  const loading = state.loading?.pageLoading;

  return (
    <Overlay {...overlayProps} visible={loading}>
      <View className="wrapper" style={{ ...wrapperStyleBase, ...wrapperStyle }}>
        <Loading direction="vertical" children="加载中..." {...loadingProps} />
      </View>
    </Overlay>
  );
};

export default PageLoading;
