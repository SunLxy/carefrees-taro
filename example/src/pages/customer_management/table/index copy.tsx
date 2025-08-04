import { View } from '@tarojs/components';
import { Card, Layout } from '@carefrees/taro-ui';
import { useProxy } from '@carefrees/taro-utils/esm/valtio';

const MainTable = () => {
  const [state, , instance] = useProxy('customer_management');
  const dataList = state.dataList || [];

  return (
    <List
      itemHeight={200}
      data={dataList}
      itemKey="customerId"
      onRefresh={async () => instance.main_onSearch()}
      onLoadMore={() => instance.main_onLoadMore()}
    >
      {(item, index) => {
        return (
          <View
            key={item.customerId}
            style={{ padding: index === 0 ? '14px' : '0 14px 14px', boxSizing: 'border-box', width: '100%' }}
          >
            <Card title={item.customerShortName} extra={item.customerStatus} footer={<View>按钮</View>}>
              <Layout title="客户名称">{item.customerName}</Layout>
              <Layout title="客户联系人">{item.customerContact}</Layout>
              <Layout title="联系人电话">{item.conntactPhone}</Layout>
              <Layout title="企业电话">{item.enterprisePhone}</Layout>
              <Layout title="企业地址">{item.enterpriseAddress}</Layout>
            </Card>
          </View>
        );
      }}
    </List>
  );
};

export default MainTable;
