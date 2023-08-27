import { FilterContext } from 'contexts/filter.context'
import React, { useContext } from 'react'
import Statistic from './Statistic'

const ByStatus = () => {
  const { statuses } = useContext(FilterContext);
  return (
    <Statistic 
      param_string="status_id"
      selects={statuses}
      title="TRẠNG THÁI"
    />
  )
}

export default ByStatus