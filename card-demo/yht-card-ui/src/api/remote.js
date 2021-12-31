// 获取企业属性列表
import request from "../libs/remoteRequest";

// 获取所有企业属性
export function getCompanyAttributes () {
    return request({
        url: '/common/companyfield/list',
        method: 'get'
    })
}

// 获取项目列表（远程）
export function getRemoteProjectList () {
    return request({
        url: '/common/project/list?pageNum=1&pageSize=10',
        method: 'get'
    })
}

// 查询项目所需公司字段
export function getRemoteProjectAttributes (id) {
    return request({
        url: `/common/companyfield/project/${ id }`,
        method: 'get'
    })
}

// 提交项目所需公司字段
export function updateRemoteProjectAttributes (data) {
    return request({
        url: '/common/companyfield/project',
        method: 'post',
        data: data
    }).then(res => {
        if (res.code === 200) return Promise.resolve(res)
        else return Promise.reject(res)
    })
}

// 获取接口列表
export function getApiList (params) {
    return request({
        url: '/data_interface/getInterfaceList',
        method: 'get',
        params: params
    })
}

// 获取卡片数据
export function getCardData (card, router) {
    const params = {
        cardId: card.i,
        parkId: router.params.projectId
    }
    if (card.param && router.query[card.param]) params[card.param] = router.query[card.param]
    return request({
        url: card.dataInterface,
        method: 'get',
        params: params
    })
}

// 搜索
export function searchCompanyList (params) {
    return request({
        url: '/data_interface/getCompanyByName',
        method: 'get',
        params: params
    })
}
