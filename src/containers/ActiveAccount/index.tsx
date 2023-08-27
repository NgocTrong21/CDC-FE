import authApi from 'api/auth.api';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ActiveAccount = () => {

  const navigate = useNavigate();
  const params: any = useParams();
  const active_token: string = params.active_token;
  
  const handleActiveAccount = () => {
    authApi.active({ active_token })
      .then((res: any) => {
        const { success, message } = res.data;
        if(success) {
          toast.success("Kích hoạt tài khoản thành công. Vui lòng đăng nhập tiếp!");
        } else {
          toast.error(message);
        }
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => navigate("/signin"))
  }

  useEffect(() => {
    if(!active_token) return;
    handleActiveAccount();
  }, [active_token])

  return (
    <div>Tài khoản đang được kích hoạt...</div>
  )
}

export default ActiveAccount