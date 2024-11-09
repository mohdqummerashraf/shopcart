import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cartSlice', 'WishlistSlice'], // specify which slices to persist
  };
  
  export default persistConfig;
  