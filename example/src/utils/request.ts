import { RequestInstance } from '@carefrees/taro-utils';
import { isH5 } from './isH5';

export const request = new RequestInstance({
  IP: (_url, _module, _env) => {
    // "/api": "http://188.18.5.16:6601",
    // 开发环境的时候使用
    if (isH5) {
      return '';
    }
    return 'http://188.18.5.16:6601';
  },
});
