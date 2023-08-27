import { FilterContext } from 'contexts/filter.context'
import React, { useContext } from 'react'
import Statistic from './Statistic'

const ByRiskLevel = () => {
  const { levels } = useContext(FilterContext);
  return (
    <Statistic 
      param_string="risk_level"
      selects={levels}
      title="MỨC ĐỘ RỦI RO"
    />
  )
}

export default ByRiskLevel
