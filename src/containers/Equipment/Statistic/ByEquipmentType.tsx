import { FilterContext } from 'contexts/filter.context'
import React, { useContext } from 'react'
import Statistic from './Statistic'

const ByEquipmentType = () => {
  const { types } = useContext(FilterContext);
  return (
    <Statistic 
      param_string="type_id"
      selects={types}
      title="LOẠI THIẾT BỊ"
    />
  )
}

export default ByEquipmentType