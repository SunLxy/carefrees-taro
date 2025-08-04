import React, { Fragment } from 'react';
import { PageToastProps, PageToast } from './../PageToast';
import { PageLoading, PageLoadingProps } from './../PageLoading';
import { RequestToast } from '../RequestToast';

export interface ConnectToastLoadingOptions extends PageToastProps, PageLoadingProps {
  /**全局的pageLoading配置*/
  global?: PageLoadingProps;
}

const connectToastLoading_weapp = (
  Component: React.FC,
  namespace: string | undefined | null,
  options: ConnectToastLoadingOptions = {},
) => {
  const { global = {}, ...rest } = options;
  /**weapp环境*/
  return (props: any) => {
    return (
      <Fragment>
        <Component {...props} />
        {namespace ? <PageLoading {...rest} namespace={namespace} /> : <Fragment />}
        {namespace ? <PageToast namespace={namespace} /> : <Fragment />}
        {namespace ? <RequestToast namespace={namespace} /> : <Fragment />}
        <PageLoading {...global} namespace="global" />
        <PageToast namespace="global" />
        <RequestToast namespace="global" />
      </Fragment>
    );
  };
};

const connectToastLoadingTaro = (
  Component: React.FC,
  namespace: string | undefined | null,
  options: ConnectToastLoadingOptions = {},
) => {
  const { global = {}, ...rest } = options;
  return (props: any) => {
    return (
      <Fragment>
        <Component {...props} />
        {namespace ? <PageLoading {...rest} namespace={namespace} /> : <Fragment />}
        {namespace ? <PageToast namespace={namespace} /> : <Fragment />}
        {namespace ? <RequestToast namespace={namespace} /> : <Fragment />}
      </Fragment>
    );
  };
};

export const connectToastLoading =
  process.env.TARO_ENV === 'weapp' ? connectToastLoading_weapp : connectToastLoadingTaro;

export default connectToastLoading;
