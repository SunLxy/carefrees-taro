import { View } from '@tarojs/components';
import { Card } from '@carefrees/taro-ui';
import { useProxy } from '@carefrees/taro-utils/esm/valtio';

const MainTable = () => {
  const [state, , instance] = useProxy('customer_management');
  const dataList = state.dataList || [];
  console.log(dataList);
  return (
    <Card>
      <View>212</View>
    </Card>
  );
};

export default MainTable;
