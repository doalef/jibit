const request = require('request');

const BASE_URL = 'https://pg.jibit.mobi';
const API_LIST = {
  AUTH: BASE_URL + '/authenticate',
  REFRESH: BASE_URL + '/authenticate/refresh',
  ORDER_INITIATE: BASE_URL + '/order/initiate',
  VERIFY: BASE_URL + '/order/verify/',
  INQUIRY: BASE_URL + '/order/inquiry/'
};

const init = (username, password, cb = () => {}) => {
  request.post(
    {
      uri: API_LIST.AUTH,
      json: { username, password }
    },
    (err, result) => {
      if (err) return cb(err);
      if (value.errorCode == 0) {
        cb(null, 'JIBIT INITIATED', value.result);
      } else {
        cb(value);
      }
    }
  );
};

const refresh = (token, refreshToken, cb = () => {}) => {
  request.post(
    {
      uri: API_LIST.REFRESH,
      json: { token, refreshToken }
    },
    (err, value) => {
      if (err) return cb(err);
      if (value.errorCode == 0)
        return cb(null, 'TOKEN REFRESHED', value.result);
      if (value.errorCode == 401)
        return cb('AUTHENTICATION FAILED, TOKEN IS EXPIRED');
    }
  );
};

const initOrder = (
  token,
  amount,
  callBackUrl,
  userIdentity,
  merchantOrderId,
  description,
  cb = () => {}
) => {
  request.post(
    {
      uri: API_LIST.ORDER_INITIATE,
      headers: { Authorization: 'Bearer ' + token },
      json: { amount, callBackUrl, userIdentity, merchantOrderId, description }
    },
    (err, value) => {
      if (err) return cb(err);
      if (value.errorCode == 0) cb(null, value.result);
      else if (value.errorCode === 401)
        return cb('AUTHENTICATION FAILED, TOKEN IS EXPIRED');
    }
  );
};

const verify = (orderid, token, cb = () => {}) => {
  request.post(
    {
      uri: API_LIST.VERIFY + orderid,
      headers: { Authorization: 'Bearer ' + token }
    },
    (err, value) => {
      if (err) return cb(err);
      if (value.errorCode == 0) {
        cb(null, value.result);
      } else if (value.errorCode == 401) {
        return cb('AUTHENTICATION FAILED, TOKEN IS EXPIRED');
      }
    }
  );
};

const inquiry = (orderid, token, cb = () => {}) => {
  request.post(
    {
      uri: API_LIST.INQUIRY + orderid,
      headers: { Authorization: 'Bearer ' + token }
    },
    (err, value) => {
      if (err) return cb('INQUIRY TASK FAILED!');
      if (value.errorCode == 0) {
        cb(null, value.result);
      } else if (value.errorCode == 401) {
        return cb('AUTHENTICATION FAILED, TOKEN IS EXPIRED');
      }
    }
  );
};

module.exports = { API_LIST, init, refresh, verify, inquiry, initOrder };
