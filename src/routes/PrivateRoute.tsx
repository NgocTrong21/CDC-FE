import React from 'react';
import { Navigate } from 'react-router-dom';
import LayoutSystem from 'containers/Layout';
import { ACCESS_TOKEN, CURRENT_USER } from 'constants/auth.constant';
import NotFoundPage from 'containers/NotFoundPage';

interface PrivateProps {
  children: React.ReactNode;
  permission?: number;
}

const PrivateRoute = ({ children, permission }: PrivateProps) => {
  const isLoggin: boolean = Boolean(localStorage.getItem(ACCESS_TOKEN));
  console.log(isLoggin);
  const userDetail: any = localStorage.getItem(CURRENT_USER) || '{}';
  console.log(userDetail);

  const userPermissons: any = JSON.parse(userDetail)?.Role?.Role_Permissions;
  console.log(userPermissons);
  const checkPermission: boolean = userPermissons?.find(
    (userPermisson: any) => userPermisson?.permission_id === permission
  );
  console.log(checkPermission);

  return isLoggin ? (
    <>
      {checkPermission ? (
        <LayoutSystem>{children}</LayoutSystem>
      ) : (
        <NotFoundPage />
      )}
    </>
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoute;
