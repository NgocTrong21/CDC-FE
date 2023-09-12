import React, { createContext, useEffect, useState } from 'react';
import filterApi from 'api/filter.api';
import { ACCESS_TOKEN, CURRENT_USER } from 'constants/auth.constant';

interface FilterContextData {
  statuses: Array<object>[];
  departments: Array<object>[];
  projects: Array<object>[];
  groups: Array<object>[];
  types: Array<object>[];
  cycles: Array<object>[];
  services: Array<object>[];
  roles: Array<object>[];
  units: Array<object>[];
  levels: Array<object>[];
  providers: Array<object>[];
  user: any;
}

export const FilterContext = createContext<FilterContextData>({
  statuses: [],
  departments: [],
  projects: [],
  groups: [],
  types: [],
  cycles: [],
  services: [],
  roles: [],
  units: [],
  levels: [],
  providers: [],
  user: {},
});

interface FilterContextProps {
  children: React.ReactNode;
}

const FilterContextProvider: React.FC<FilterContextProps> = ({ children }) => {
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [types, setTypes] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [units, setUnits] = useState([]);
  const [projects, setProjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [providers, setProviders] = useState([]);
  const access_token: any = localStorage.getItem(ACCESS_TOKEN);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '{}');

  const getAllFilter = async () => {
    await Promise.all([
      filterApi.getAllRoleApi(),
      filterApi.getServiceApi(),
      filterApi.getGroupEquipmentApi(),
      filterApi.getDepartmentApi(),
      filterApi.getStatusEquipmentApi(),
      filterApi.getTypeEquipmentApi(),
      filterApi.getAllUnitApi(),
      filterApi.getAllRiskLevelApi(),
      filterApi.getProviderApi(),
      filterApi.getProjectApi(),
    ])
      .then((res: any) => {
        const [
          roles,
          services,
          groups,
          departments,
          statuses,
          types,
          units,
          levels,
          providers,
          projects,
        ] = res;
        setRoles(roles?.data?.data?.roles);
        setServices(services?.data?.data?.services);
        setGroups(groups?.data?.data?.groups);
        setDepartments(departments?.data?.data?.departments);
        setStatuses(statuses?.data?.data?.statuses);
        setTypes(types?.data?.data?.types);
        setUnits(units?.data?.data?.units);
        setLevels(levels?.data?.data?.risk_levels);
        setProviders(providers?.data?.data?.providers);
        setProjects(projects?.data?.data?.projects);
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
    groups,
    types,
    cycles,
    services,
    roles,
    units,
    levels,
    providers,
    user,
    projects,
  };

  return (
    <FilterContext.Provider value={FilterContextData}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
