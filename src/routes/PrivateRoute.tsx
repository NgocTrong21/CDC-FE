import React from 'react'
import { Navigate } from 'react-router-dom'
import LayoutSystem from 'containers/Layout';
import { ACCESS_TOKEN, CURRENT_USER } from 'constants/auth.constant';
import NotFoundPage from 'containers/NotFoundPage';

interface PrivateProps {
    children: React.ReactNode,
    permission?: string
}

const PrivateRoute = ({ children, permission }: PrivateProps) => {
    const isLoggin: boolean = Boolean(localStorage.getItem(ACCESS_TOKEN));
    const userDetail: any = localStorage.getItem(CURRENT_USER) || '{}';
    const userPermissons: any = JSON.parse(userDetail)?.Role?.Role_Permissions;
    const checkPermission: boolean = userPermissons?.find((userPermisson: any) => userPermisson?.Permission?.name === permission)

    return isLoggin ? <>{checkPermission ? <LayoutSystem>{children}</LayoutSystem> : <NotFoundPage/>}</> : <Navigate to='/signin'/>
}

export default PrivateRoute;