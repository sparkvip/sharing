/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export function queryList(params) {
  // return request('/api/sys/category/query');
  return request('/api/resource/query', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}