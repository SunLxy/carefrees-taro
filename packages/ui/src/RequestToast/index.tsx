import { View, ViewProps } from '@tarojs/components';
import {
  RequestToastDataType,
  useProxy,
  ProxyInstanceObject,
  ProxyInstanceObjectStoreType,
} from '@carefrees/taro-utils/esm/valtio';
import { Fragment } from 'react';

const RequestToastItem = (props: { item: RequestToastDataType }) => {
  const { item } = props;
  const { title, content, type = 'none' } = item;
  return (
    <View className={`carefrees_ui-taro-request-toast-item ${type}`}>
      {title ? <View className="carefrees_ui-taro-request-toast-item-title">{title}</View> : <Fragment />}
      {content ? <View className="carefrees_ui-taro-request-toast-item-body">{content}</View> : <Fragment />}
    </View>
  );
};

export interface RequestToastProps extends ViewProps {
  /**状态名*/
  namespace?: string | undefined | null;
}

export const RequestToast = (props: RequestToastProps) => {
  const [state] = useProxy<ProxyInstanceObjectStoreType, ProxyInstanceObject<ProxyInstanceObjectStoreType>>(
    props.namespace,
  );
  const requestToastData = state.__requestToastData || [];
  if (Array.isArray(requestToastData) && requestToastData.length)
    return (
      <View className="carefrees_ui-taro-request-toast">
        {requestToastData.map((item) => {
          if (item.visible) return <RequestToastItem key={item.__id} item={item} />;
          return <Fragment key={item.__id} />;
        })}
      </View>
    );
  return <Fragment />;
};

RequestToast.Item = RequestToastItem;

export default RequestToast;
