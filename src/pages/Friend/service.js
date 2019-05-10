/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export function queryList(params) {
  // return request('/api/sys/category/query');
  return request('/api/resource/query/my', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export function update(params) {
  // return request('/api/sys/category/query');
  return request('/api/resource/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export function remove(params) {
  return request('/api/resource/remove', {
    method: 'POST',
    data:[...params]
    ,
  });
}