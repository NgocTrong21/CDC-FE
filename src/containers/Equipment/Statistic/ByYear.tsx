import React, { useState } from 'react'
import Statistic from './Statistic'

const ByYear = () => {
  const years = [
    {
      id: "2010",
      name: "2010"
    },
    {
      id: "2011",
      name: "2011"
    },
    {
      id: "2012",
      name: "2012"
    },
    {
      id: "2013",
      name: "2013"
    },
    {
      id: "2014",
      name: "2014"
    },
    {
      id: "2015",
      name: "2015"
    },
    {
      id: "2016",
      name: "2016"
    },
    {
      id: "2017",
      name: "2017"
    },
    {
      id: "2018",
      name: "2018"
    },
    {
      id: "2019",
      name: "2019"
    },
    {
      id: "2020",
      name: "2020"
    },
    {
      id: "2021",
      name: "2021"
    },
    {
      id: "2022",
      name: "2022"
    },
  ]
  const [title, setTitle] = useState<string>('NĂM SẢN XUẤT');
  const [param, setParam] = useState<string>('year_of_manufacture');
  const isShowTab: boolean = true;

  const onChangeTab = (key: string) => {
    if(key === "1") {
      setTitle("NĂM SẢN XUẤT");
      setParam("year_of_manufacture");
    }
    if(key === "2") {
      setTitle("NĂM SỬ DỤNG");
      setParam("year_in_use");
    }
  }

  return (
    <Statistic 
      param_string={param}
      selects={years}
      title={title}
      show_tab={isShowTab}
      onChangeTab={onChangeTab}
    />
  )
}

export default ByYear