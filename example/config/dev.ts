import type { UserConfigExport } from '@tarojs/cli';
// const ip = require('ip').address(); // 获取本机ip

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://188.18.5.16:6601', // 后端地址
          changeOrigin: true,
          // pathRewrite: {
          //   '^/api': ''
          // }
        },
      },
    },
  },
} as UserConfigExport<'webpack5'>;
