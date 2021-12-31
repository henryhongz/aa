import {
    getParkList, getLandStatus, getLandStatusList, getEconomicValue, getEconomicValueList, getIndustryStatus, getIndustryStatusList, getEnterpriseInfo, getLaborForce, getIndustryOutput, getLandUse, getHomePerBenefit, getTotalTax,
    getOutput,
    getIncome,
    getTax,
    getProfiles,
    getAddValue,
    getLabor,
    getStatistics,
    getLanduse,
    getEnergy,
    getIndustry,
    getVideo,
    getEnterpriseRankList,
    getHome
} from '@/api/home'

const home = {
    namespaced: true,
    state: {
        scaleValue: 1, // 自适应缩放比例
        cruiseFlag: false, // 巡航标志
        backHomeId: '', // 返回首页id
        enterpriseRank: {
          flag: false, // 显影标志
          tab: '1' // tab页。1：全部企业，2：规上企业，3：规下企业
        }, // 企业排行标志
        parkList: [], // 园区列表
        landStatus: null, // 土地现状
        landStatusList: null, // 土地现状列表
        economicValue: null, // 经济数值
        economicValueList: null, // 经济数值列表
        industryStatus: null, // 产业现状
        industryStatusList: null, // 产业现状列表
        enterpriseInfo: null, // 企业信息
        laborForce: null, // 劳动人力
        industryOutput: null, // 工业产值
        landUse: null, // 用地统计
        homePerBenefit: null, // 亩产效益
        totalTax: null, // 税收总额
        output: null, // 工业产值
        income: null, // 营业收入
        tax: null, // 税收总额
        addValue: null, // 亩均增加值
        labor: null, // 劳动生产率
        statistics: null, // 企业统计
        landuse: null, // 用地统计
        energy: null, // 工业能耗
        industry: null, // 产业现状汇总
        video: null, // 视频
        profiles: null, // 利润
        enterpriseRankList: null // 企业排行
    },
    mutations: {
        SET_SCALE_VALUE (state, params) {
            state.scaleValue = params
        },
        SET_CRUISE_FLAG (state, params) {
            state.cruiseFlag = params
        },
        SET_BACK_HOME_ID (state, params) {
            state.backHomeId = params
        },
        SET_ENTERPRISE_RANK (state, params) {
            state.enterpriseRank = params
        },
        SET_PARK_LIST (state, params) {
            state.parkList = params
        },
        SET_LAND_STATUS (state, params) {
            state.landStatus = params
        },
        SET_LAND_STATUS_LIST (state, params) {
            state.landStatusList = params
        },
        SET_ECONOMIC_VALUE (state, params) {
            state.economicValue = params
        },
        SET_ECONOMIC_VALUE_LIST (state, params) {
            state.economicValueList = params
        },
        SET_INDUSTRY_STATUS (state, params) {
            state.industryStatus = params
        },
        SET_INDUSTRY_STATUS_LIST (state, params) {
            state.industryStatusList = params
        },
        SET_ENTERPRISE_INFO (state, params) {
            state.enterpriseInfo = params
        },
        SET_LABOR_FORCE (state, params) {
            state.laborForce = params
        },
        SET_INDUSTRY_OUTPUT (state, params) {
            state.industryOutput = params
        },
        SET_LAND_USE_LIST (state, params) {
            state.landUse = params
        },
        SET_HOME_PER_BENEFIT_LIST (state, params) {
            state.homePerBenefit = params
        },
        SET_TOTAL_TAX_LIST (state, params) {
            state.totalTax = params
        },
        SET_OUTPUT (state, params) {
            state.output = params
        },
        SET_INCOME (state, params) {
            state.income = params
        },
        SET_TAX (state, params) {
            state.tax = params
        },
        SET_PROFILES (state, params) {
            state.profiles = params
        },
        SET_ADDVALUE (state, params) {
            state.addValue = params
        },
        SET_LABOR (state, params) {
            state.labor = params
        },
        SET_STATISTICS (state, params) {
            state.statistics = params
        },
        SET_LANDUSE (state, params) {
            state.landuse = params
        },
        SET_ENERGY (state, params) {
            state.energy = params
        },
        SET_INDUSTRY (state, params) {
            state.industry = params
        },
        SET_VIDEO (state, params) {
            state.video = params
        },
        SET_ENTERPRISE_RANK_LIST (state, params) {
            state.enterpriseRankList = params
        }
    },
    actions: {
        SetScaleValue ({ commit }, params) {
            commit('SET_SCALE_VALUE', params)
        },
        SetCruiseFlag ({ commit }, params) {
            commit('SET_CRUISE_FLAG', params)
        },
        SetBackHomeId ({ commit }, params) {
            commit('SET_BACK_HOME_ID', params)
        },
        SetEnterpriseRank ({ commit }, params) {
            commit('SET_ENTERPRISE_RANK', params)
        },
        GetParkList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getParkList(params).then(res => {
                    if (res) {
                        const data = window.defaultSettings.isMock ? res.data.list : res.data.data.list
                        commit('SET_PARK_LIST', data)
                        resolve(data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetLandStatus ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLandStatus(params).then(res => {
                    if (res) {
                        const data = window.defaultSettings.isMock ? res.data : res.data.data
                        commit('SET_LAND_STATUS', data)
                        resolve(data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetLandStatusList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLandStatusList(params).then(res => {
                    if (res) {
                        const data = window.defaultSettings.isMock ? res.data : res.data.data
                        commit('SET_LAND_STATUS_LIST', data)
                        resolve(data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetEconomicValue ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getEconomicValue(params).then(res => {
                    if (res) {
                        const data = window.defaultSettings.isMock ? res.data : res.data.data
                        commit('SET_ECONOMIC_VALUE', data)
                        resolve(data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetEconomicValueList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getEconomicValueList(params).then(res => {
                    if (res) {
                        const data = window.defaultSettings.isMock ? res.data : res.data.data
                        commit('SET_ECONOMIC_VALUE_LIST', data)
                        resolve(data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetIndustryStatus ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getIndustryStatus(params).then(res => {
                    if (res) {
                        const data = window.defaultSettings.isMock ? res.data : res.data.data
                        commit('SET_INDUSTRY_STATUS', data)
                        resolve(data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetIndustryStatusList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getIndustryStatusList(params).then(res => {
                    if (res) {
                        const data = window.defaultSettings.isMock ? res.data : res.data.data
                        commit('SET_INDUSTRY_STATUS_LIST', data)
                        resolve(data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetEnterpriseInfo ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getEnterpriseInfo(params).then(res => {
                    if (res) {
                        commit('SET_ENTERPRISE_INFO', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetLaborForce ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLaborForce(params).then(res => {
                    if (res) {
                        commit('SET_LABOR_FORCE', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetIndustryOutput ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getIndustryOutput(params).then(res => {
                    if (res) {
                        commit('SET_INDUSTRY_OUTPUT', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetLandUse ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLandUse(params).then(res => {
                    if (res) {
                        commit('SET_LAND_USE_LIST', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetHomePerBenefit ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getHomePerBenefit(params).then(res => {
                    if (res) {
                        const data = window.defaultSettings.isMock ? res.data : res.data.data
                        commit('SET_HOME_PER_BENEFIT_LIST', data)
                        resolve(data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetTotalTax ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getTotalTax(params).then(res => {
                    if (res) {
                        commit('SET_TOTAL_TAX_LIST', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetOutput ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getOutput(params).then(res => {
                    if (res) {
                        commit('SET_OUTPUT', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetIncome ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getIncome(params).then(res => {
                    if (res) {
                        commit('SET_INCOME', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetTax ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getTax(params).then(res => {
                    if (res) {
                        commit('SET_TAX', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetProfiles ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getProfiles(params).then(res => {
                    if (res) {
                        commit('SET_PROFILES', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetAddValue ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getAddValue(params).then(res => {
                    if (res) {
                        commit('SET_ADDVALUE', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetLabor ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLabor(params).then(res => {
                    if (res) {
                        commit('SET_LABOR', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetStatistics ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getStatistics(params).then(res => {
                    if (res) {
                        commit('SET_STATISTICS', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetLanduse ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLanduse(params).then(res => {
                    if (res) {
                        commit('SET_LANDUSE', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetEnergy ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getEnergy(params).then(res => {
                    if (res) {
                        commit('SET_ENERGY', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetIndustry ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getIndustry(params).then(res => {
                    if (res) {
                        commit('SET_INDUSTRY', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetVideo ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getVideo(params).then(res => {
                    if (res) {
                        commit('SET_VIDEO', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetEnterpriseRankList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getEnterpriseRankList(params).then(res => {
                    if (res) {
                        commit('SET_ENTERPRISE_RANK_LIST', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetHome ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getHome(params).then(res => {
                    if (res) {
                        const data = res.data
                        commit('SET_ADDVALUE', data.addValue)
                        commit('SET_ENERGY', data.energy)
                        commit('SET_INCOME', data.income)
                        commit('SET_INDUSTRY', data.industry)
                        commit('SET_LABOR', data.labor)
                        commit('SET_LANDUSE', data.landuse)
                        commit('SET_OUTPUT', data.output)
                        commit('SET_PARK_LIST', data.parkList.list)
                        commit('SET_PROFILES', data.profiles)
                        commit('SET_STATISTICS', data.statistics)
                        commit('SET_TAX', data.tax)
                        commit('SET_VIDEO', data.video)
                        commit('SET_INDUSTRY_STATUS_LIST', data.industryStatusList)
                        commit('SET_ECONOMIC_VALUE_LIST', {
                            enterprise: data.statistics,
                            ...data.tax,
                            output: data.output
                        })
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        }
    }
}

export default home
