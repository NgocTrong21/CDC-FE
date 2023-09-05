import { call, put, takeEvery } from '@redux-saga/core/effects';
import authApi from 'api/auth.api';
import {
  ACCESS_TOKEN,
  CURRENT_USER,
  REFRESH_TOKEN,
} from 'constants/auth.constant';
import { push } from 'connected-react-router';
import { authActions } from '../slices/auth.slice';
export interface ProcessResponseType {
  code: any;
  data: any;
  message: string;
  success: Boolean;
  status: any;
}

function* handleRegister(action: any) {
  const payload = action.payload;
  try {
    const response: ProcessResponseType = yield call(authApi.register, payload);
    const { message, success } = response?.data;
    if (success)
      yield put(
        authActions.registerRequestFinish(
          'Đã gửi link kích hoạt vào email. Bạn vui lòng kiểm tra email'
        )
      );
    else yield put(authActions.registerRequestFinish(message));
  } catch (error: any) {
    console.log(`error`, error?.response);
    yield put(authActions.registerRequestFinish(''));
  }
}

function* handleLogin(action: any) {
  const payload = action.payload;
  try {
    const response: ProcessResponseType = yield call(authApi.login, payload);
    const { data, message, success } = response?.data;
    if (success) {
      localStorage.setItem(ACCESS_TOKEN, data?.access_token);
      localStorage.setItem(REFRESH_TOKEN, data?.refresh_token);
      localStorage.setItem(CURRENT_USER, JSON.stringify(data?.user || {}));
      yield put(authActions.loginSuccess(data?.user));
      yield put(push('/'));
      window.location.reload();
    } else {
      yield put(authActions.loginFailed(message));
    }
  } catch (error: any) {
    yield put(authActions.loginFailed(error?.response?.data?.message || ''));
  }
}

function* handleLogout() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(CURRENT_USER);
  yield put(push('/signin'));
  window.location.reload();
}

const authSaga = [
  takeEvery(authActions.registerRequest.type, handleRegister),
  takeEvery(authActions.login.type, handleLogin),
  takeEvery(authActions.logout.type, handleLogout),
];

export default authSaga;
