import request from '@/utils/request';

export function queryList() {
  return request('/api/sys/category/query');
}