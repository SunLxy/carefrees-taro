import { View } from '@tarojs/components';
import { Button } from '@nutui/nutui-react-taro';
import { useValtioState, useProxy } from '@carefrees/taro-utils/esm/valtio';
import { connectToastLoading, Card } from '@carefrees/taro-ui';
// import { request } from "@/utils/request"
import './index.scss';

function Index() {
  const [state] = useValtioState({ time: '' });
  const [, , instance] = useProxy('global');

  const onSubmit = async () => {};

  const onTest = async () => {
    // try {
    //   const result = await request.POST('/api/selectPage2', { data: { "page": 1, "pageSize": 20 } })
    //   console.log(result)
    // } catch (error) {
    //   console.log(error)
    // }
    instance._updatedRequestToast({ content: '请求数据失败', icon: 'fail' });
  };

  return (
    <View className="nutui-react-demo">
      <View className="index">
        欢迎使用 NutUI React 开发 Taro 多端项目。
        {state.time}
      </View>
      <Button type="primary" className="btn" onClick={onTest}>
        测试提示信息
      </Button>
      <View style={{ padding: 20, width: '100%', boxSizing: 'border-box' }}>
        <Card title="标题" extra="extra" footer="底部内容" isLineZero>
          cccc
        </Card>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button type="primary" className="btn" onClick={onSubmit}>
          提交
        </Button>
        {/* <Button type="primary" className="btn" onClick={() => {
          // dispatch({ time: new Date().getTime().toString() })
          // Taro.navigateTo({ url: "/pages/about/index" })
        }}>
          NutUI React Button
        </Button> */}
      </View>
    </View>
  );
}

export default connectToastLoading(Index, undefined);
