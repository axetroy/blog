// lib
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
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

  // persist rehydrate
  enhancers.push(autoRehydrate());

  const store = createStore(rootReducer, compose(...enhancers));

  // 持久化数据
  persistStore(
    store,
    {
      storage: localForage,
      keyPrefix: '[A]'
    },
    function() {
      storeInitCallback();
    }
  );

  return store;
}

export function onStoreDone(callback) {
  storeInitCallback = callback;
}
