import { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { ConfigProvider } from '@nutui/nutui-react-taro';
import { connectToastLoading } from '@carefrees/taro-ui';
import './.models';
// 全局样式
// import './app.scss'

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});
  return <ConfigProvider>{props.children}</ConfigProvider>;
}

export default connectToastLoading(App, 'global');
