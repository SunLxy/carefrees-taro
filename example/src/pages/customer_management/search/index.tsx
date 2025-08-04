import { View } from '@tarojs/components';
import { useProxy } from '@carefrees/taro-utils/esm/valtio';
import { useEffect } from 'react';

const MainSearch = () => {
  const [, , instance] = useProxy('customer_management');

  useEffect(() => {
    instance.main_onSearch();
  }, []);

  return <View>dddd</View>;
};

export default MainSearch;
