import { Button, Checkbox, Divider } from 'antd';
import permissionApi from 'api/permission.api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import roleApi from 'api/role.api';
import Loading from 'components/Loading';

const UpdatePermission = () => {
  const params: any = useParams();
  const { role, id } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  const getAllPermissionOfRole = async () => {
    setLoading(true);
    await Promise.all([permissionApi.list(), roleApi.detail(id)])
      .then((res: any) => {
        const [permissions, roles] = res;
        const a: any = permissions?.data?.data?.permissions;
        const b: any = roles?.data?.data?.role;
        let array: any = a.map((item: any) => {
          item?.permissions?.forEach((x: any) => {
            let check_array = b?.Role_Permissions?.filter(
              (y: any) => x.id === y.permission_id
            );
            x.is_check = check_array?.length === 0 ? false : true;
          });
          let isFullCheck: any = item?.permissions?.filter(
            (x: any) => x.is_check === false
          );
          item.is_check = isFullCheck?.length === 0 ? true : false;
          return item;
        });
        setPermissions(array);
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAllPermissionOfRole();
  }, []);

  const setActive = (item: any) => {
    let r: any = permissions.map((permission: any) => {
      if (item.id === permission.id) {
        permission.is_active = !permission.is_active;
      }
      return permission;
    });
    setPermissions(r);
  };

  const setCheckRole = (item: any) => {
    let r: any = permissions.map((permission: any) => {
      if (item.id === permission.id) {
        permission.is_check = !permission.is_check;
        let i = permission.permissions.map((x: any) => ({
          ...x,
          is_check: item.is_check,
        }));
        permission.permissions = i;
      }
      return permission;
    });
    setPermissions(r);
  };

  const setCheckPermission = (item: any) => {
    item.is_check = !item.is_check;
    let r: any = permissions.map((permission: any) => {
      let isFullCheck: any = permission.permissions.filter(
        (y: any) => y.is_check === false
      );
      permission.is_check = isFullCheck?.length === 0 ? true : false;
      return permission;
    });
    setPermissions(r);
  };

  const updatePermission = () => {
    setLoadingUpdate(true);
    let r: any = [];
    permissions.forEach((item: any) => {
      item.permissions.forEach((permission: any) => {
        if (permission.is_check === true) {
          r.push(permission);
        }
      });
    });
    permissionApi
      .updatePermissionForRole({ role_id: id, permissions: r })
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Cập nhật thành công!');
        } else {
          toast.error(message);
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CẬP NHẬT QUYỀN SỬ DỤNG</div>
        <div className="flex flex-row">
          <div className="title">CHỨC VỤ: </div>
          <div className="title ml-2 uppercase">{role}</div>
        </div>
      </div>
      <Divider />
      <div>
        <div className="title mb-4">QUYỀN</div>
        {loading ? (
          <Loading />
        ) : (
          <div className="ml-6">
            {permissions.map((item: any) => (
              <div className="cursor-pointer">
                <div className="flex flex-row gap-4" key={item?.id}>
                  <Checkbox
                    checked={item?.is_check}
                    onChange={() => setCheckRole(item)}
                  />
                  <div className="text-base font-bold mb-2">
                    {item?.display_name}
                  </div>
                  <div
                    className="hover:transition-all"
                    onClick={() => setActive(item)}
                  >
                    {!item?.is_active ? <RightOutlined /> : <DownOutlined />}
                  </div>
                </div>
                <div
                  className={`ml-8 transition-all ${
                    item?.is_active ? 'block' : 'hidden'
                  }`}
                >
                  {item?.permissions?.length > 0 &&
                    item?.permissions?.map((permission: any) => (
                      <>
                        <div
                          className="flex flex-row gap-4"
                          key={permission?.id}
                        >
                          <Checkbox
                            checked={permission?.is_check}
                            onChange={() => setCheckPermission(permission)}
                          />
                          <div className="text-base font-bold mb-2">
                            {permission?.display_name}
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center">
          <Button
            className="button-primary"
            loading={loadingUpdate}
            onClick={() => updatePermission()}
          >
            CẬP NHẬT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePermission;
