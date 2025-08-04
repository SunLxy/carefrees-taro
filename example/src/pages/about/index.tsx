import { View } from '@tarojs/components';
import { Button } from '@nutui/nutui-react-taro';
import { connectPage, useContextProxy, useProxy } from '@carefrees/taro-utils/esm/valtio';
import { connectToastLoading } from '@carefrees/taro-ui';
import PageInterface, { PageStoreInterface } from './model';

function Index() {
  const [state, dispatch] = useContextProxy<any, PageStoreInterface>();
  const [, , globalInstance] = useProxy('global');
  return (
    <View>
      <Button
        type="primary"
        onClick={() => {
          dispatch({ time: new Date().getTime().toString() });
          globalInstance.updatedLoading(true);
          setTimeout(() => {
            globalInstance.updatedLoading(false);
          }, 5000);
        }}
      >
        Button time {state?.time || ''}
      </Button>
    </View>
  );
}

export default connectPage(PageInterface, connectToastLoading(Index, PageInterface.namespace));
