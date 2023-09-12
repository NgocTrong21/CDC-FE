import notificationApi from 'api/notification.api';
import React, { createContext, useState, useEffect } from 'react';
import { ACCESS_TOKEN } from 'constants/auth.constant';

interface NotificationData {
  count: number,
  increaseCount: () => void,
  decreaseCount: () => void,
  resetCount: () => void,
  notification: Array<object>[],
  getAllNotifications: () => void,
}

interface NotificationProps {
  children: React.ReactNode
}

export const NotificationContext = createContext<NotificationData>({
  count: 0,
  increaseCount: () => {},
  decreaseCount: () => {},
  resetCount: () => {},
  notification: [],
  getAllNotifications: () => {},
})

const NotificationProvider: React.FC<NotificationProps> = ({ children }) => {

  const [count, setCount] = useState<number>(0);
  const [notification, setNotification] = useState<any>([]);
  const access_token: any = localStorage.getItem(ACCESS_TOKEN);

  const increaseCount = () => {
    setCount(x => x + 1);
  }

  const decreaseCount = () => {
    setCount(x => x - 1);
  }

  const resetCount = () => {
    setCount(0);
  }

  const getAllNotifications = () => {
    notificationApi.list(1)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setNotification(data?.notifications?.rows);
          setCount(data?.notifications?.count);
        }
      })
      .catch()
  }

  useEffect(() => {
    if(access_token) {
      getAllNotifications();
    }
  }, [access_token])

  const NotificationContextData = {
    count,
    increaseCount,
    decreaseCount,
    resetCount,
    notification,
    getAllNotifications,
    
  }

  return (
    <NotificationContext.Provider value={NotificationContextData}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider