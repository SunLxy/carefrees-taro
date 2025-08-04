/**
 * 1. 使用名称获取实例存储
 */
import { useMemo, createContext, createElement, useRef, useState, useEffect, useContext } from 'react';
import { useSnapshot } from 'valtio';
import CacheInstance, { ProxyInstanceObject, ProxyInstanceObjectStoreType } from './instance';
export * from './instance';
export default CacheInstance;

/**
 * 创建或者取值
 * 当传递name值的时候，如果存储中不存在，则创建一个，
 * @param {string} name 实例名
 * @param {boolean} isSave 是否存储
 */
export const useProxy = <
  T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType,
  K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>,
>(
  name: string,
  isSave: boolean = false,
) => {
  /**取 proxy 对象*/
  const proxyState = useMemo(() => CacheInstance.createProxy<T, K>({ name: name, isSave }), [name, isSave]);
  const state = useSnapshot(proxyState.store);
  const dispatch = (value: Partial<T>, type: 'ref' | 'none' = 'ref') => {
    if (type === 'ref') {
      proxyState._setObjectRefValues(value);
    } else {
      proxyState._setValues(value);
    }
  };
  return [state, dispatch, proxyState, proxyState.store, (state as any).___default] as [
    T,
    (value: Partial<T>, type?: any) => void,
    K,
    T,
    any,
  ];
};

export const ProxyInstanceContext = createContext<ProxyInstanceObject>(new ProxyInstanceObject());

export interface ProxyInstanceProviderProps<T> {
  children: React.ReactNode;
  instance: T;
}

export const ProxyInstanceProvider = <
  T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType,
  K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>,
>(
  props: ProxyInstanceProviderProps<K>,
) => {
  return createElement(ProxyInstanceContext.Provider, {
    value: props.instance,
    children: props.children,
  });
};

/**
 * 取当前 Context 下的状态管理实例
 */
export const useContextProxy = <
  T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType,
  K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>,
>() => {
  const proxyInstance = useContext(ProxyInstanceContext) as K;
  const state = useSnapshot(proxyInstance.store);
  const dispatch = (value: Partial<T>, type: 'ref' | 'none' = 'ref') => {
    if (type === 'ref') {
      proxyInstance._setObjectRefValues(value);
    } else {
      proxyInstance._setValues(value);
    }
  };
  return [state, dispatch, proxyInstance, proxyInstance.store, (state as any).___default] as [
    T,
    (value: Partial<T>) => void,
    K,
    T,
    any,
  ];
};

/**
 * 根据名称获取
 * 没名称自动返回一个对象(默认这个对象是不进行缓存)
 * @param name 缓存状态管理实例名称
 * @param inital 初始值(当缓存状态管理实例不存在时使用)
 * @param isSave 是否存储缓存实例(当缓存状态管理实例不存在时使用)
 *
 */
export const useNameProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(
  name: string,
  inital?: T,
  isSave: boolean = false,
) => {
  const proxyInstance = useRef(CacheInstance.createProxy<T, K>({ name, inital, isSave }));

  const state = useSnapshot(proxyInstance.current.store);
  const dispatch = (value: Partial<T>, type: 'ref' | 'none' = 'ref') => {
    if (type === 'ref') {
      proxyInstance.current._setObjectRefValues(value);
    } else {
      proxyInstance.current._setValues(value);
    }
  };

  return [state, dispatch, proxyInstance.current, proxyInstance.current.store, (state as any).___default] as [
    T,
    (value: Partial<T>) => void,
    K,
    T,
    any,
  ];
};

/**创建简单的状态管理*/
export const useValtioState = <
  T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType,
  K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>,
>(
  inital?: T,
) => {
  const instance = useRef(new ProxyInstanceObject<T>()._ctor(inital));
  const state = useSnapshot(instance.current.store);
  const dispatch = (value: Partial<T>, type: 'ref' | 'none' = 'ref') => {
    if (type === 'ref') {
      instance.current._setObjectRefValues(value);
    } else {
      instance.current._setValues(value);
    }
  };

  return [state, dispatch, instance.current, instance.current.store, (state as any).___default] as unknown as [
    T,
    (value: Partial<T>) => void,
    K,
    T,
    any,
  ];
};

/**
 * 创建页面状态
 * @param namespace:状态名称
 * @param MainPageInstance:状态实例
 * @param Component:入口页面组件
 *
 */
export const connectMainPage = <
  T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType,
  K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>,
  M extends { new (...args: any[]): K } = { new (...args: any[]): K },
>(
  namespace: string | undefined | null,
  MainPageInstance: M,
  Component: React.FC,
) => {
  const pageInstance = new MainPageInstance(namespace);
  return (props: any) => {
    const [proxyInstance] = useState(
      CacheInstance.createProxy<T, K>({
        name: namespace,
        instanceObject: pageInstance.main_page_ctor?.(),
      }),
    );
    useEffect(() => {
      return () => {
        /**当值不存在的时候，页面卸载重新加载数据*/
        if (!namespace) proxyInstance.is_main_page_ctor = false;
      };
    }, []);
    return createElement(ProxyInstanceProvider, {
      instance: proxyInstance,
      children: createElement(Component, { ...props }),
    });
  };
};

/**
 * 创建页面状态
 * @param MainPageInstance:状态实例
 * @param Component:入口页面组件
 *
 */
export const connectPage = <
  T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType,
  K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>,
>(
  instance: K,
  Component: React.FC,
) => {
  return (props: any) => {
    return createElement(ProxyInstanceProvider, {
      instance: instance,
      children: createElement(Component, { ...props }),
    });
  };
};
