import request from '@/utils/request'
import formalRequest from '@/utils/formalRequest'
import cache from './cache'

// 获取总产值
const getTotalOutput = (id) => {
    return request.get(`/park/totalOutput/${id}`)
}

// 获取亩均效益指标
const getPerBenefit = (id) => {
    return request.get(`/park/perBenefit/${id}`)
}

// 获取经营情况
const getBusinessCase = (id) => {
    return request.get(`/park/businessCase/${id}`)
}

// 获取环境情况
const getEnvironmentalSituation = (id) => {
    return request.get(`/park/environmentalSituation/${id}`)
}

// 获取信用数据
const getCreditData = (id) => {
    return request.get(`/park/creditData/${id}`)
}

// 获取信用数据
const getComprehensiveEvaluation = (id) => {
    return request.get(`/park/comprehensiveEvaluation/${id}`)
}

// 获取园区企业详情
const getEnterpriseList = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`/park/enterpriseList/${id}`, {
    adapter: cache({
      local: false
    }) })
  } else {
    return formalRequest.get(`/park/enterpriseList/${id}`, {
    adapter: cache({
      local: false // 是否永久保留在本地，默认为false
    }) })
  }
}

// 获取漫游路径
const getRoamPath = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`/park/roamPath/${id}`)
  } else {
    return formalRequest.get(`park/roamPath/${id}`)
  }
}

// 获取工业产值(园区)
const getIndustrialOutput = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/output/${id}`)
  } else {
    return formalRequest.get(`park2/output/${id}`)
  }
}

// 获取营业收入(园区)
const getOperatingIncome = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/income/${id}`)
  } else {
    return formalRequest.get(`park2/income/${id}`)
  }
}

// 税收总额(园区)
const getParkTotalTax = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/tax/${id}`)
  } else {
    return formalRequest.get(`park2/tax/${id}`)
  }
}

// 利润(园区)
const getProfit = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/profiles/${id}`)
  } else {
    return formalRequest.get(`park2/profiles/${id}`)
  }
}

// 均亩增加值(园区)
const getAcreIncrease = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/addValue/${id}`)
  } else {
    return formalRequest.get(`park2/addValue/${id}`)
  }
}

// 劳动生产率
const getLaborProductivity = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/labor/${id}`)
  } else {
    return formalRequest.get(`park2/labor/${id}`)
  }
}

// 企业情况
const getBusinessStatistics = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/statistics/${id}`)
  } else {
    return formalRequest.get(`park2/statistics/${id}`)
  }
}

// 工业能耗
const getIndustrialEnergy = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/energy/${id}`)
  } else {
    return formalRequest.get(`park2/energy/${id}`)
  }
}

// 产业现状汇总
const getIndustrySummary = (id) => {
  if (window.defaultSettings.isMock) {
    return request.get(`park2/industry/${id}`)
  } else {
    return formalRequest.get(`park2/industry/${id}`)
  }
}

const getPark = (id) => {
  if (window.defaultSettings.isMock) {
      return request.get(`park/${id}`, {
        adapter: cache({
            local: false
        }) })
  } else {
    return formalRequest.get(`park/${id}`, {
      adapter: cache({
          local: false
      }) })
  }
}

export {
  getTotalOutput,
  getPerBenefit,
  getBusinessCase,
  getEnvironmentalSituation,
  getCreditData,
  getComprehensiveEvaluation,
  getEnterpriseList,
  getRoamPath,
  getIndustrialOutput,
  getOperatingIncome,
  getParkTotalTax,
  getProfit,
  getAcreIncrease,
  getLaborProductivity,
  getBusinessStatistics,
  getIndustrialEnergy,
  getIndustrySummary,
  getPark
 }
