/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export function queryList(params) {
  // return request('/api/sys/category/query');
  return request('/api/aduit/query', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export function agree(params) {
  // return request('/api/sys/category/query');
  return request('/api/aduit/agree', {
    method: 'POST',
    data: [...params]
  });
}
export function reject(params) {
  return request('/api/aduit/reject', {
    method: 'POST',
    data:[...params]
    ,
  });
}