import { proxy, ref } from 'valtio';
import React from 'react';
import type { ToastProps } from '@nutui/nutui-react-taro';

export interface ProxyCacheInstanceOptions<
  T extends Object = any,
  K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>,
> {
  /**命名*/
  name?: string | undefined | null;
  /**初始值*/
  inital?: T;
  /**传递一个已经对象*/
  instanceObject?: K;
  /**是否进行存储*/
  isSave?: boolean;
}

export class ProxyInstanceMapCache {
  /**存储的数据*/
  proxyMap: Map<string, ProxyInstanceObject<any>> = new Map([]);
  /**创建一个Proxy*/
  createProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(
    options: ProxyCacheInstanceOptions<T, K> = {},
  ) => {
    const { name, inital, instanceObject: proxyObject, isSave = true } = options;
    if (name && this.proxyMap.has(name)) {
      return this.proxyMap.get(name) as K;
    }
    let instProxy: K;
    if (proxyObject) {
      instProxy = proxyObject;
    } else {
      instProxy = new ProxyInstanceObject()._ctor(inital || {}) as K;
    }
    if (name && isSave) {
      this.proxyMap.set(name, instProxy);
    }
    return instProxy as K;
  };
  /**获取*/
  getProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(name: string) => {
    return this.proxyMap.get(name) as K;
  };
  /**删除一个Proxy*/
  deleteProxy = (name: string) => {
    if (name) this.proxyMap.delete(name);
  };
  /**判断是否已经存在*/
  isProxy = (name: string) => {
    return this.proxyMap.has(name);
  };
}
const CacheInstance = new ProxyInstanceMapCache();

export default CacheInstance;

export interface RequestToastDataType extends Omit<Partial<ToastProps>, 'title'> {
  /**唯一值*/
  __id: string | number;
}

export interface ProxyInstanceObjectStoreType extends Object {
  /**loading存储*/
  loading?: Record<string, boolean>;
  /**当前页*/
  page?: number;
  /**分页数*/
  pageSize?: number;
  /**总数*/
  total?: number;
  /**是否最后一页*/
  hasLastPage?: boolean;
  /**查询条件*/
  search?: Object;
  /**表格数据*/
  dataList?: any[];
  /**选择行数据*/
  selectedRows?: any[];
  selectedRowKeys?: any[];
  toastConfig?: Partial<ToastProps>;
  __requestToastData?: RequestToastDataType[];
  [s: string]: any;
}

/**
 * 单个proxy对象数据基础实例封装
 */
export class ProxyInstanceObject<T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType> {
  /**proxy 可状态更新字段 */
  store = proxy<T>({} as T);

  /**初始化存储值*/
  _ctor = (inital?: T, file?: string[]) => {
    this._setObjectRefValues(inital || {}, file);
    return this;
  };
  /**设置对象属性值*/
  _setValues = <K = T>(value?: K) => {
    if (value) {
      Object.keys(value).forEach((key) => {
        // @ts-ignore
        this.store[key] = value[key];
      });
    }
    return this;
  };
  /**设置对象属性值*/
  _setRefValues = <K = T>(value?: K) => {
    if (value) {
      Object.keys(value).forEach((key) => {
        // @ts-ignore
        this.store[key] = ref(value[key]);
      });
    }
    return this;
  };

  /**更新store数据 循环对象进行存储，当值是对象的时候存储为ref*/
  _setObjectRefValues = <K = T>(values: Partial<K>, file?: string[]) => {
    if (!this.store) {
      this.store = proxy({}) as T;
    }
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (Array.isArray(file) && file.includes(key)) {
        // @ts-ignore
        this.store[key] = values[key];
      } else if (React.isValidElement(value) || typeof value === 'function') {
        // @ts-ignore
        this.store[key] = ref(values[key]);
      } else if (typeof value === 'object' && value !== null) {
        // @ts-ignore
        this.store[key] = ref(values[key]);
      } else {
        // @ts-ignore
        this.store[key] = values[key];
      }
    });
    return this;
  };
  /**获取数据 循环对象进行存储，当值是对象的时候存储为ref*/
  _getObjectRefValues = <K = T>(values: Partial<K>, file?: string[]) => {
    const store = {};
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (Array.isArray(file) && file.includes(key)) {
        store[key] = values[key];
      } else if (React.isValidElement(value) || typeof value === 'function') {
        store[key] = ref(values[key]);
      } else if (typeof value === 'object' && value !== null) {
        store[key] = ref(values[key]);
      } else {
        store[key] = values[key];
      }
    });
    return store;
  };
  /**删除字段值*/
  _deleteValue = (names: string | string[]) => {
    if (Array.isArray(names)) {
      let cacheValue = this.store;
      const newNames = [...names];
      const lastField = newNames.pop();
      for (let index = 0; index < newNames.length; index++) {
        cacheValue = cacheValue[newNames[index]];
      }
      if (cacheValue && lastField) {
        delete cacheValue[lastField];
      }
    } else {
      delete this.store[names];
    }
    return this;
  };
  /**创建 ref 对象 (ref对象不做监听更新)*/
  _createRef = <K extends Object = any>(inital?: K) => {
    return ref<K>(inital || ({} as K)) as K;
  };
  /**获取所有的缓存实例*/
  _getAllProxyCache = () => {
    return CacheInstance;
  };
  /**从缓存中获取对应的 proxy 对象*/
  _getProxyCache = (name: string) => {
    return CacheInstance.getProxy(name);
  };

  /**==============页面封装==============*/

  /**页面状态名称*/
  namespace = '';
  /**判断是否已经实例化*/
  is_main_page_ctor = false;
  /**是否滚动加载分页*/
  is_scroll_page = true;

  /**默认值*/
  defaultInital = {
    /**当前页*/
    page: 1,
    /**分页数*/
    pageSize: 10,
    /**总数*/
    total: 0,
    /**查询条件*/
    search: ref({}),
    /**表格数据*/
    dataList: ref([]),
    /**选择行数据*/
    selectedRows: ref([]),
    selectedRowKeys: ref([]),
    /**加载状态*/
    loading: { pageLoading: false },
    toastConfig: {},
    // 页面 接口请求 提示内容
    __requestToastData: ref([]),
    /**是否最后一页*/
    hasLastPage: false,
  };

  /**用于更新请求提示信息*/
  _updatedRequestToast = (options: Omit<RequestToastDataType, '__id'> & { __id?: string }, time: number = 3000) => {
    const _that = this;
    let newItem = { ...options } as RequestToastDataType;
    if (!_that.store.__requestToastData) {
      _that.store.__requestToastData = ref([]);
    }
    newItem.visible = true;
    if (!newItem.__id) {
      newItem.__id = `${new Date().valueOf()}__${_that.store.__requestToastData.length + 1}`;
    }
    _that.store.__requestToastData = ref([..._that.store.__requestToastData].concat([newItem]));
    if (time) {
      const timer = setTimeout(() => {
        newItem.visible = false;
        _that.store.__requestToastData = ref(_that.store.__requestToastData.filter((it) => it.__id !== newItem.__id));
        clearTimeout(timer);
      }, time);
    }
  };

  requestConfig?: {
    /**请求之前处理参数*/
    onBefore?: (payload: any, store: T) => Record<string, unknown>;
    /**请求接口*/
    getList?: (payload: any) => Promise<{ code?: number; data?: any; message?: string }>;
    /**请求之后处理返回值进行存储*/
    onAfter?: (data: Record<string, any>) => Record<string, any>;
    /** code!==1 时 触发*/
    onError?: (data: Record<string, any>) => void;
  } = {};

  /**初始化实例
   * @param {string} namespace 命名
   * @param {Boolean} isDelete 如果存在是否删除命名，重新存储
   */
  _create_Instance = <
    M extends ProxyInstanceObjectStoreType = T,
    K extends ProxyInstanceObject<M> = ProxyInstanceObject<M>,
  >(
    namespace?: string,
    isDelete: boolean = false,
  ) => {
    const name = namespace || this.namespace;
    if (!name) {
      return this;
    }
    if (!this.namespace) {
      this.namespace = name;
    }
    /**是否删除当前命名*/
    if (isDelete) {
      CacheInstance.deleteProxy(this.namespace);
    }
    const instance = CacheInstance.createProxy<T>({
      name: name,
      instanceObject: this.main_page_ctor?.(),
    });
    return instance as unknown as K;
  };

  constructor(namespace?: string) {
    if (namespace) this.namespace = namespace;
  }

  /**初始化状态值*/
  main_page_store = (initalValues: Partial<T> = {}, file?: string[]) => {
    const newStore = { ...this.defaultInital, ...initalValues } as unknown as T;
    this._ctor(newStore, [...(file || []), 'loading']);
  };

  /**更新页面级的 pageLoading */
  updatedLoading = (loading: boolean = true) => {
    if (typeof this.store?.loading === 'object') {
      this.store.loading.pageLoading = loading;
    } else {
      this.store.loading = { pageLoading: loading };
    }
  };

  /**更新页面级的 提示框配置 */
  updatedToast = (config: Partial<ToastProps> = {}) => {
    this.store.toastConfig = this._createRef({ ...config });
  };

  /**默认实例化方法*/
  main_page_ctor = () => {
    if (this.is_main_page_ctor) {
      return this;
    }
    this.is_main_page_ctor = true;
    this.main_page_store();
    return this;
  };

  /**内置——查询列表*/
  main_getList = async () => {
    if (!this.requestConfig?.getList) {
      console.error('未配置 requestConfig.getList 请求方法');
      return;
    }
    try {
      this.updatedLoading(true);
      const payload = {
        ...this.store.search,
        page: this.store.page,
        pageSize: this.store.pageSize,
      };
      let newParams = { ...payload } as any;
      if (this.requestConfig?.onBefore) {
        newParams = this.requestConfig.onBefore(payload, this.store);
      }
      const result = await this.requestConfig.getList?.(newParams);
      this.updatedLoading(false);
      this.store.loading.loadMore = false;

      if (result && result.code === 1) {
        let saveData = {};
        if (this.requestConfig?.onAfter) {
          saveData = this.requestConfig.onAfter(result);
        } else {
          const dataList = result?.data?.list || result?.data?.records || [];
          /**如果是第一页则直接返回数据，否则进行拼接数据*/
          let newDataList = [];
          if (this.store.page === 1) {
            newDataList = dataList;
          } else if (this.is_scroll_page) {
            newDataList = [...this.store.dataList, ...dataList];
          }
          saveData = {
            dataList: newDataList,
            total: result?.data?.total || 0,
            /**选择行数据*/
            selectedRows: ref([]),
            selectedRowKeys: ref([]),
          };
        }
        if (saveData) this._setObjectRefValues(saveData);
      } else if (this.requestConfig?.onError) {
        this.requestConfig.onError(result);
      }
    } catch (error) {
      console.log(error);
      this.store.loading.loadMore = false;
      this.updatedLoading(false);
    }
  };

  /**内置——翻页*/
  main_onPageChange = (page: number) => {
    this._setObjectRefValues({ page });
    this.main_getList();
  };

  /**内置——翻页切换*/
  main_onShowSizeChange = (_: number, pageSize: number) => {
    this._setObjectRefValues({ page: 1, pageSize });
    this.main_getList();
  };

  /**内置——查询方法*/
  main_onSearch = () => {
    this.main_onPageChange(1);
  };

  /**加载更多*/
  main_onLoadMore = () => {
    if (this.store.loading?.pageLoading) {
      // 加载中，不进行请求
      return;
    }
    const total = this.store.total || 0;
    const page = this.store.page || 1;
    const pageSize = this.store.pageSize || 20;
    const count = Math.ceil(total / pageSize);
    let hasLastPage = false;
    if (page >= count && total) {
      // 已经最后一页数据了
      hasLastPage = true;
      this._setObjectRefValues({ hasLastPage });
      return;
    }
    const nextPage = page + 1;
    if (nextPage >= count && total) {
      // 当前是最后一页数据
      hasLastPage = true;
    }
    this.store.loading.loadMore = true;
    // 判断是否最后一页数据
    this._setObjectRefValues({ page: nextPage, hasLastPage });
    this.main_getList();
  };
}
