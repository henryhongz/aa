import request from '@/utils/request'
import formalRequest from '@/utils/formalRequest'
import cache from './cache'

// 基本情况
export function getBasicInfo () {
    return request({
        url: '/df_data/park_infos?pid=200',
        method: 'get'
    })
}

// 孵化赋能统计
export function getEggOut () {
    return request.get('/df_data/inves_total_count')
}

// 园区经营统计
export function getParkStatistic () {
    return request.get('/df/index-management/20')
}

// 累计招商数量
export function getTotalBussiness () {
    return request.get('/df_data/hat_eger_bar?hid=1')
}

// 累计税收优惠
export function getTotalTaxReduce () {
    return request.get('/df_data/hat_eger_bar?hid=3')
}

// 累计房租减免
export function getTotalRentReduce () {
    return request.get('/df_data/hat_eger_bar?hid=2')
}

// 累计企服次数
export function getTotalCompanyService () {
    return request.get('/df_data/hat_eger_bar?hid=4')
}

// 累计水电优惠
export function getTotalWaterElecReduce () {
    return request.get('/df_data/hat_eger_bar?hid=5')
}

// 累计本年新招商数量
export function getNowYearNewBussiness () {
  return request.get('/df_data/hat_eger_bar?hid=6')
}

// 产业情况
export function getIndustryInfo () {
    return request({
        url: '/df_data/com_indclass?pid=200',
        method: 'get'
    })
}

// 人才情况
export function getTalentsInfo () {
    return request({
        url: '/df_data/staff_edu',
        method: 'get'
    })
}

// 园区动态
export function getParkNews () {
    return request({
        url: '/df_data/park_dyna',
        method: 'get'
    })
}

// 企服统计
export function getCompanyServiceStatistic () {
    return request.get('/df_data/company/service/statistics?pid=200')
}

// 获取园区列表
export const getParkList = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home/parkList')
    } else {
        return formalRequest.get('/home/parkList')
    }
}

// 获取土地现状(园区)
export const getLandStatus = (id) => {
    if (window.defaultSettings.isMock) {
        return request.get(`/home/landStatus/${id}`)
    } else {
        return formalRequest.get(`/home/landStatus/${id}`)
    }
}

// 获取土地现状列表
export const getLandStatusList = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home/landStatusList')
    } else {
        return formalRequest.get('/home/landStatusList')
    }
}

// 获取经济数值（园区）
export const getEconomicValue = (id) => {
    if (window.defaultSettings.isMock) {
        return request.get(`/home/economicValue/${id}`)
    } else {
        return formalRequest.get(`/home/economicValue/${id}`)
    }
}

// 获取经济数值列表
export const getEconomicValueList = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home/economicValueList')
    } else {
        return formalRequest.get('/home/economicValueList')
    }
}

// 获取产业现状(园区)
export const getIndustryStatus = (id) => {
    if (window.defaultSettings.isMock) {
        return request.get(`/home/industryStatus/${id}`)
    } else {
        return formalRequest.get(`/home/industryStatus/${id}`)
    }
}

// 获取产业现状列表
export const getIndustryStatusList = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home/industryStatusList')
    } else {
        return formalRequest.get('/home/industryStatusList')
    }
}

// 获取企业信息
export const getEnterpriseInfo = () => {
    return request.get('/home/enterpriseInfo')
}

// 获取劳动人力
export const getLaborForce = () => {
    return request.get('/home/laborForce')
}

// 获取工业产值
export const getIndustryOutput = () => {
    return request.get('/home/industryOutput')
}

// 获取用地统计
export const getLandUse = () => {
    return request.get('/home/landUse')
}

// 获取工业产值
export const getOutput = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/output')
    } else {
        return formalRequest.get('/home2/output')
    }
}

// 获取营业收入
export const getIncome = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/income')
    } else {
        return formalRequest.get('/home2/income')
    }
}

// 获取税收总额
export const getTax = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/tax')
    } else {
        return formalRequest.get('/home2/tax')
    }
}

// 获取利润
export const getProfiles = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/profiles')
    } else {
        return formalRequest.get('/home2/profiles')
    }
}

// 获取亩均增加值
export const getAddValue = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/addValue')
    } else {
        return formalRequest.get('/home2/addValue')
    }
}

// 获取劳动生产率
export const getLabor = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/labor')
    } else {
        return formalRequest.get('/home2/labor')
    }
}

// 获取劳动生产率
export const getStatistics = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/statistics')
    } else {
        return formalRequest.get('/home2/statistics')
    }
}

// 获取用地统计
export const getLanduse = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/landuse')
    } else {
        return formalRequest.get('/home2/landuse')
    }
}

// 获取产业现状汇总(公司数)
export const getEnergy = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/energy')
    } else {
        return formalRequest.get('/home2/energy')
    }
}

// 获取产业现状汇总(产业产值)
export const getIndustry = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/industry')
    } else {
        return formalRequest.get('/home2/industry')
    }
}

// 获取视频
export const getVideo = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home2/video')
    } else {
        return formalRequest.get('/home2/video')
    }
}

// 获取亩产效益
export const getHomePerBenefit = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home/perBenefit')
    } else {
        return formalRequest.get('/home/perBenefit')
    }
}

// 获取税收总额
export const getTotalTax = () => {
    return request.get('/home/totalTax')
}

// 获取企业排行
export const getEnterpriseRankList = (params) => {
    if (window.defaultSettings.isMock) {
        return request.get('/home/enterpriseRankList', {
            params: {
                parkId: params.parkId,
                type: params.type,
                current: params.current,
                pageSize: params.pageSize
            }
        })
    } else {
        return formalRequest.get('/home/enterpriseRankList', {
            params: {
                parkId: params.parkId,
                type: params.type,
                current: params.current,
                pageSize: params.pageSize
            }
        })
    }
}

// 首页信息汇总
export const getHome = () => {
    if (window.defaultSettings.isMock) {
        return request.get('/home', {
        adapter: cache({
            local: false
        }) })
    } else {
        return formalRequest.get('http://47.118.53.118:9999/home/20/', {
        adapter: cache({
            local: false
        }) })
    }
}
