import { useProxy } from '@carefrees/taro-utils/esm/valtio';
import { Toast } from '@nutui/nutui-react-taro';

export interface PageToastProps {
  namespace?: string | undefined | null;
}

export const PageToast = (props: PageToastProps) => {
  const [state, dispatch, proxyInstance] = useProxy(props.namespace);
  const toastConfig = state.toastConfig as any;

  return (
    <Toast
      {...toastConfig}
      visible={toastConfig?.visible || false}
      onClose={() => {
        toastConfig?.onClose?.();
        dispatch({ toastConfig: { ...proxyInstance.store.toastConfig, visible: false } });
      }}
    />
  );
};
export default PageToast;
