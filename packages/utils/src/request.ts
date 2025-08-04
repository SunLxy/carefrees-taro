import Taro from '@tarojs/taro';
import CacheInstance from './valtio/index';

const codeMessage = {
  // 200: '服务器成功返回请求的数据',
  // 201: '新建或修改数据成功',
  400: '发出的请求错误',
  401: '用户没有权限',
  403: '用户访问被禁止',
  404: '请求不存在，服务器没有进行操作',
  406: '请求的格式错误',
  410: '资源被永久删除',
  422: '验证错误',
  500: '服务器发生错误，请检查服务器',
  502: 'nginx异常',
  503: '服务不可用，服务器暂时过载或维护',
  504: 'nginx超时',
} as const;

export interface RequestInstanceOptions extends Omit<Taro.request.Option<any, any>, 'url'> {
  /**模块名称*/
  module?: string;
}

/**处理提示信息*/
const requestResponseHandle = (result: Taro.request.SuccessCallbackResult<any>) => {
  const instance = CacheInstance.getProxy('global');
  let msg = '';
  try {
    const statusCode = result.statusCode;
    const code = result?.data?.code;
    if (result?.data) {
      if (statusCode === 401 || code === 401) {
        // 权限问题 ，重新登录
        msg = '请重新登录';
      } else if (![1, 200].includes(code)) {
        // 提示内容
        msg = result?.data?.message || '接口异常';
      }
    } else {
      msg = codeMessage[result?.statusCode];
    }
  } catch (error) {
    msg = codeMessage[result?.statusCode];
    console.log(error);
  }
  if (msg && instance) {
    instance._updatedRequestToast({
      content: msg || '请求发生错误',
      icon: 'fail',
    });
  }
};

export interface RequestInstanceCreateOptions {
  IP?: string | ((url: string, module?: string, env?: string) => string);
}

export class RequestInstance {
  /**请求IP地址*/
  public IP?: string | ((url: string, module?: string, env?: string) => string);

  constructor(options: RequestInstanceCreateOptions = {}) {
    this.IP = options.IP;
  }

  /**获取请求地址*/
  public getHttpPath = (url: string, module?: string) => {
    if (typeof this.IP === 'function') {
      return this.IP(url, module, process.env.NODE_ENV) || '';
    }
    return this.IP || '';
  };

  static create(options: RequestInstanceCreateOptions) {
    const request = new RequestInstance(options);
    return request;
  }

  /**格式化地址*/
  formatUrl = (url: string, module?: string) => {
    let ip = this.getHttpPath(url, module);
    if (ip) {
      ip = ip.replace(/\/$/, '');
    }
    const newUrl = `${url}`.replace(/^\//, '').replace(/\/$/, '');

    if (module && process.env.NODE_ENV === 'production') {
      const m = `${module}`.replace(/^\//, '').replace(/\/$/, '');
      return `${ip}/${m}/${newUrl}`;
    }
    return `${ip}/${newUrl}`;
  };

  request = (
    url: string,
    options: RequestInstanceOptions = {},
  ): Promise<{ code?: number; data?: any; message?: string }> => {
    return new Promise((resolve, reject) => {
      Taro.request({
        ...options,
        header: {
          'Content-type': 'application/json',
          accept: 'application/json,text/plain,*/*',
          ...(options?.header || {}),
        },
        url: this.formatUrl(url, options.module),
        success: (result) => {
          /**处理提示
           * 使用 global 状态管理
           * */
          requestResponseHandle(result);
          options?.success?.(result);
          resolve(result?.data);
        },
        fail: (result) => {
          const instance = CacheInstance.getProxy('global');
          if (instance) {
            instance._updatedRequestToast({
              content: result.errMsg || '请求发生错误',
              icon: 'fail',
            });
          }
          options?.fail?.(result);
          // reject(result)
        },
      }).catch((result) => {
        reject(result);
      });
    });
  };

  GET = (url: string, options: RequestInstanceOptions = {}) => {
    try {
      return this.request(url, { ...options, method: 'GET' });
    } catch (error) {
      throw error;
    }
  };

  POST = (url: string, options: RequestInstanceOptions) => {
    try {
      return this.request(url, { ...options, method: 'POST' });
    } catch (error) {
      throw error;
    }
  };
}

/** 请求*/
export const request = new RequestInstance();
export default request;
