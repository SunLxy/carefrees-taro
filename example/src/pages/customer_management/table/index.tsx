import { View } from '@tarojs/components';
import { Card, Layout } from '@carefrees/taro-ui';
import { useProxy } from '@carefrees/taro-utils/esm/valtio';

const MainTable = () => {
  const [state] = useProxy('customer_management');
  console.log(state);
  return (
    <Card>
      <Layout title="客户管理">
        <View>2121</View>
      </Layout>
    </Card>
  );
};

export default MainTable;
