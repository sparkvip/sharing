/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export function queryList(params) {
  // return request('/api/sys/category/query');
  return request('/api/friend/query/request', {
    method: 'POST',
    data: {
      id: params && params.userId,
    },
  });
}
export function queryFriend(params) {
  return request('/api/friend/query/friend', {
    method: 'POST',
    data: {
      id: params && params.userId,
    },
  });
}
export function queryResourceList(params) {
  // return request('/api/sys/category/query');
  return request('/api/friend/query/resource', {
    method: 'POST',
    data: {
      id: params && params.userId,
    },
  });
}
export function agree(params) {
  return request('/api/friend/agree', {
    method: 'POST',
    data: [...params],
  });
}
export function reject(params) {
  return request('/api/friend/reject', {
    method: 'POST',
    data: [...params],
  });
}
export function remove(params) {
  return request('/api/friend/remove', {
    method: 'POST',
    data: [...params],
  });
}
export function queryFriendList(params) {
  // return request('/api/sys/category/query');
  return request('/api/resource/query/friend/resource', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}