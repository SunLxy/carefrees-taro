import { ProxyInstanceObject } from '@carefrees/taro-utils';

export class PageStoreInterface extends ProxyInstanceObject {}

export default new PageStoreInterface('global')._create_Instance('global');
