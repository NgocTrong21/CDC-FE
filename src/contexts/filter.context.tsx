import React, { createContext, useEffect, useState } from 'react';
import filterApi from 'api/filter.api';
import { ACCESS_TOKEN, CURRENT_USER } from 'constants/auth.constant';

interface FilterContextData {
  statuses: Array<object>[];
  departments: Array<object>[];
  roles: Array<object>[];
  units: Array<object>[];
  user: any;
}

export const FilterContext = createContext<FilterContextData>({
  statuses: [],
  departments: [],
  roles: [],
  units: [],
  user: {},
});

interface FilterContextProps {
  children: React.ReactNode;
}

const FilterContextProvider: React.FC<FilterContextProps> = ({ children }) => {
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [units, setUnits] = useState([]);
  const access_token: any = localStorage.getItem(ACCESS_TOKEN);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '{}');

  const getAllFilter = async () => {
    await Promise.all([
      filterApi.getAllRoleApi(),
      filterApi.getDepartmentApi(),
      filterApi.getStatusEquipmentApi(),
      filterApi.getAllUnitApi(),
    ])
      .then((res: any) => {
        const [roles, departments, statuses, units] = res;
        setRoles(roles?.data?.data?.roles);
        setDepartments(departments?.data?.data?.departments);
        setStatuses(statuses?.data?.data?.statuses);
        setUnits(units?.data?.data?.units);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (access_token) {
      getAllFilter();
    }
  }, [access_token]);

  const FilterContextData = {
    statuses,
    departments,
    roles,
    units,
    user,
  };

  return (
    <FilterContext.Provider value={FilterContextData}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
