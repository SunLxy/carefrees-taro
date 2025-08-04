import { request } from '@/utils/request';

export const getList = (data: any) => {
  return request.POST('/api/tBasicCustomer/selectPage', { data });
};
