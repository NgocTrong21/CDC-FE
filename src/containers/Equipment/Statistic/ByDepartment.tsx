import { FilterContext } from 'contexts/filter.context'
import React, { useContext } from 'react'
import Statistic from './Statistic'

const ByDepartment = () => {
  const { departments } = useContext(FilterContext);
  return (
    <Statistic 
      param_string="department_id"
      selects={departments}
      title="KHOA PHÒNG"
    />
  )
}

export default ByDepartment