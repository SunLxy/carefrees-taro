import { ProxyInstanceObject } from '@carefrees/taro-utils/esm/valtio';
import { getList } from '../services';

export class Customer_ManagementInterface extends ProxyInstanceObject {
  requestConfig = {
    getList,
  };
}

export default new Customer_ManagementInterface('customer_management')._create_Instance('customer_management');
