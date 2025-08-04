import { ProxyInstanceObject } from '@carefrees/taro-utils/esm/valtio';

export class PageStoreInterface extends ProxyInstanceObject {}

export default new PageStoreInterface('about')._create_Instance('about');
