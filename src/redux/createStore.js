// lib
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { createLogger } from 'redux-logger';
import localForage from 'localforage';

// return log middle ware
function createLogMiddleWare() {
  return createLogger();
}

function storeInitCallback() {
  console.info('persistStore init done');
}

/**
 * 创建store
 * @param rootReducer
 * @returns {*}
 */
export default function(rootReducer) {
  const middleware = [];
  const enhancers = [];

  // log中间件
  middleware.push(createLogMiddleWare());

  // 合并中间件
  enhancers.push(applyMiddleware(...middleware));

  const store = createStore(
    persistCombineReducers(
      {
        key: '[A]',
        storage: localForage,
      },
      rootReducer
    ),
    compose(...enhancers)
  );

  // 持久化数据
  persistStore(store, null, function() {
    console.log(store.getState());
    storeInitCallback();
  });

  return store;
}

export function onStoreDone(callback) {
  storeInitCallback = callback;
}
