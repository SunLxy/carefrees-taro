import Taro from '@tarojs/taro';
/**
 * 是否是 H5 环境
 */
export const isH5 = Taro.ENV_TYPE.WEB === Taro.getEnv();
