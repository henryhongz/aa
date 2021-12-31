import {
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
} from '@/api/park'

const park = {
    namespaced: true,
    state: {
        backParkId: null, // 返回区块parkId
        flyParkId: null, // 飞行的parkId
        roamingFlag: false, // 漫游标志
        layerButton: false, // 图层按钮
        totalOutput: null, // 总产值
        perBenefit: null, // 亩均效益指标
        businessCase: null, // 经营情况
        environmentalSituation: null, // 环境情况
        creditData: null, // 信用数据
        comprehensiveEvaluation: null, // 综合评价
        enterpriseList: [], // 企业列表
        roamPath: null, // 漫游路径
        industrialoutput: {}, // 工业产值
        operatingincome: null, // 营业收入
        parktotaltax: null, // 税收总额
        profit: null, // 利润
        acreIncrease: null, // 均亩增加值
        laborProductivity: null, // 劳动生产率
        businessStatistics: null, // 企业统计
        industrialEnergy: null, // 工业能耗
        industrySummary: null, // 产业汇总
        industryStatus: null, // 产业状态
        economicValue: null, // 经济数值
        landuse: null // 企业用地
    },
    mutations: {
        SET_BACK_PARK_ID (state, params) {
            state.backParkId = params
        },
        SET_FLY_PARK_ID (state, params) {
            state.flyParkId = params
        },
        SET_ROAMING_FLAG (state, params) {
            state.roamingFlag = params
        },
        SET_LAYER_BUTTON (state, params) {
            state.layerButton = params
        },
        SET_TOTAL_OUTPUT (state, params) {
            state.totalOutput = params
        },
        SET_PER_BENEFIT (state, params) {
            state.perBenefit = params
        },
        SET_BUSINESS_CASE (state, params) {
            state.businessCase = params
        },
        SET_ENVIRONMENTAL_SITUATION (state, params) {
            state.environmentalSituation = params
        },
        SET_CREDIT_DATA (state, params) {
            state.creditData = params
        },
        SET_COMPREHENSIVE_EVALUATION (state, params) {
            state.comprehensiveEvaluation = params
        },
        SET_ENTERPRISE_LIST (state, params) {
            state.enterpriseList = params
        },
        SET_ROAM_PATH (state, params) {
            state.roamPath = params
        },
        // 工业产值
        SET_INDUSTRIAL_OUTPUT (state, params) {
            state.industrialoutput = params
        },
        // 营业收入
        SET_OPERATING_INCOME (state, params) {
          state.operatingincome = params
        },
        // 税收总额
        SET_PARK_TOTAL_TAX (state, params) {
          state.parktotaltax = params
        },
        SET_PROFIT (state, params) {
          state.profit = params
        },
        // 均亩增加值
        SET_ACREINCREASE (state, params) {
          state.acreIncrease = params
        },
        // 劳动生产率
        SET_LABOR_PRODUCTIVITY (state, params) {
          state.laborProductivity = params
        },
        // 企业统计
        SET_BUSINESS_STATISTICS (state, params) {
          state.businessStatistics = params
        },
        // 工业能耗
        SET_INDUSTRIAL_ENERGY (state, params) {
          state.industrialEnergy = params
        },
        // 产业汇总
        SET_INDUSTRY_SUMMARY (state, params) {
          state.industrySummary = params
        },
        // 产业状态
        SET_INDUSTRY_STATUS (state, params) {
          state.industryStatus = params
        },
        // 经济数值
        SET_ECONOMIC_VALUE (state, params) {
          state.economicValue = params
        },
        // 土地使用
        SET_LAND_USE (state, params) {
          state.landuse = params
        }
    },
    actions: {
        SetBackParkId ({ commit }, params) {
          commit('SET_BACK_PARK_ID', params)
        },
        SetFlyParkId ({ commit }, params) {
            commit('SET_FLY_PARK_ID', params)
        },
        SetRoamingFlag ({ commit }, params) {
            commit('SET_ROAMING_FLAG', params)
        },
        SetLayerButton ({ commit }, params) {
            commit('SET_LAYER_BUTTON', params)
        },
        GetTotalOutput ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getTotalOutput(params).then(res => {
                    if (res) {
                        commit('SET_TOTAL_OUTPUT', res.data.list)
                        resolve(res.data.list)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetPerBenefit ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getPerBenefit(params).then(res => {
                    if (res) {
                        commit('SET_PER_BENEFIT', res.data.list)
                        resolve(res.data.list)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetBusinessCase ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getBusinessCase(params).then(res => {
                    if (res) {
                        commit('SET_BUSINESS_CASE', res.data.list)
                        resolve(res.data.list)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetEnvironmentalSituation ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getEnvironmentalSituation(params).then(res => {
                    if (res) {
                        commit('SET_ENVIRONMENTAL_SITUATION', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetCreditData ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getCreditData(params).then(res => {
                    if (res) {
                        commit('SET_CREDIT_DATA', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetComprehensiveEvaluation ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getComprehensiveEvaluation(params).then(res => {
                    if (res) {
                        commit('SET_COMPREHENSIVE_EVALUATION', res.data.list)
                        resolve(res.data.list)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetEnterpriseList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getEnterpriseList(params).then(res => {
                    if (res) {
                        commit('SET_ENTERPRISE_LIST', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetRoamPath ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getRoamPath(params).then(res => {
                    if (res) {
                        commit('SET_ROAM_PATH', res.data)
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        GetIndustrialOutput ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getIndustrialOutput(params).then(res => {
                    if (res) {
                      commit('SET_INDUSTRIAL_OUTPUT', res.data)
                      resolve(res.data)
                    } else {
                      reject(res)
                    }
                })
            })
        },
        // 营业收入
        GetOperatingIncome ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getOperatingIncome(params).then((res) => {
              if (res) {
                commit('SET_OPERATING_INCOME', res.data)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        },
        GetParkTotalTax ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getParkTotalTax(params).then((res) => {
              if (res) {
                commit('SET_PARK_TOTAL_TAX', res.data)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        },
        GetProfit ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getProfit(params).then((res) => {
              if (res) {
                commit('SET_PROFIT', res.data)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        },
        GetAcreIncrease ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getAcreIncrease(params).then((res) => {
              if (res) {
                commit('SET_ACREINCREASE', res.data)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        },
        GetLaborProductivity ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getLaborProductivity(params).then((res) => {
              if (res) {
                commit('SET_LABOR_PRODUCTIVITY', res.data)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        },
        GetBusinessStatistics ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getBusinessStatistics(params).then((res) => {
              if (res) {
                commit('SET_BUSINESS_STATISTICS', res.data)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        },
        GetIndustrialEnergy ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getIndustrialEnergy(params).then((res) => {
              if (res) {
                commit('SET_INDUSTRIAL_ENERGY', res.data)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        },
        GetIndustrySummary ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getIndustrySummary(params).then((res) => {
              if (res) {
                commit('SET_INDUSTRY_SUMMARY', res.data)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        },
        GetPark ({ commit }, params) {
          return new Promise((resolve, reject) => {
            getPark(params).then((res) => {
              if (res) {
                const data = res.data
                commit('SET_ACREINCREASE', data.addValue)
                commit('SET_INDUSTRIAL_ENERGY', data.energy)
                commit('SET_ENTERPRISE_LIST', data.enterpriseList)
                commit('SET_OPERATING_INCOME', data.income)
                commit('SET_INDUSTRY_SUMMARY', data.industry)
                commit('SET_LABOR_PRODUCTIVITY', data.labor)
                commit('SET_INDUSTRIAL_OUTPUT', data.output)
                commit('SET_PROFIT', data.profiles)
                commit('SET_ROAM_PATH', data.roamPath)
                commit('SET_BUSINESS_STATISTICS', data.statistics)
                commit('SET_PARK_TOTAL_TAX', data.tax)
                commit('SET_INDUSTRY_STATUS', data.industryStatusList)
                commit('SET_ECONOMIC_VALUE', {
                  enterprise: data.statistics,
                  ...data.tax,
                  output: data.output
                })
                commit('SET_LAND_USE', data.landuse)
                resolve(res.data)
              } else {
                reject(res)
              }
            })
          })
        }
    }
}

export default park
