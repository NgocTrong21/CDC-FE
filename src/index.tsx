import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import FilterContextProvider from 'contexts/filter.context';
import NotificationProvider from 'contexts/notification.context';
import { Spin } from 'antd';
import store from 'store/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div className="spinner"><Spin size="large" tip="Loading..." /></div>}>
        <FilterContextProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </FilterContextProvider>
      </Suspense>
    </Provider>
  // </React.StrictMode>
);