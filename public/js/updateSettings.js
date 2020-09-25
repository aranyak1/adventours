/* eslint-disable */

import { showAlert } from './alert';

// type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const Response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const res = await Response.json();
    if (res.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated data!!!`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    if (res.status === 'fail') {
      throw res;
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};
