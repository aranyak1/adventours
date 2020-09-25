/* eslint-disable */

import { showAlert } from './alert';

export const signUp = async (email, name, password, passwordConfirm) => {
  try {
    // console.log(email, name, password, passwordConfirm);
    const Response = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password, passwordConfirm }),
    });
    const res = await Response.json();
    if (res.status === 'success') {
      showAlert('success', 'Sign up successful!!!');
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

export const logout = async () => {
  const currentLocation = window.location.href;
  try {
    const Response = await fetch('/api/v1/users/logout');
    const res = await Response.json();
    // console.log(res);
    if (res.status === 'success') {
      // console.log(currentLocation);
      location.reload(true);
      if (res.status === 'fail') {
        throw res;
      }
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again later');
  }
};
