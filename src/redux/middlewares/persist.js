async function mapStateToStorage(store, config) {
  const state = store.getState();
  await new Promise(function(resolve, reject) {
    config.storage.setItem(
      "persist:" + config.key,
      JSON.stringify(state),
      err => (err ? reject(err) : resolve())
    );
  });
}

function mapStorageToState(state, config, cb) {
  config.storage.getItem("persist:" + config.key, function(err, value) {
    cb(err, { ...state, ...JSON.parse(value) });
  });
}

class Storage {
  constructor() {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        this[key] = JSON.parse(localStorage[key]);
      }
    }
  }
  getItem(key, cb) {
    const val = localStorage.getItem(key);
    cb(null, val);
  }
  setItem(key, item, cb) {
    localStorage.setItem(key, item);
    cb(null);
  }
  removeItem(key, cb) {
    localStorage.removeItem(key);
    cb(null);
  }
}

function persist(
  config = { key: "[rz]", storage: new Storage() },
  cb = () => {}
) {
  mapStorageToState({}, config, cb);

  // return middleware
  return store => next => action => {
    const r = next(action);
    if (r && typeof r.then === "function") {
      return next(action).then(d => {
        return mapStateToStorage(store, config).then(() => Promise.resolve(d));
      });
    } else {
      return mapStateToStorage(store, config).then(() => Promise.resolve(r));
    }
  };
}

export default persist;
