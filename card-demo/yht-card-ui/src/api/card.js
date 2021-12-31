import request from '../libs/request'

// 获取卡片列表
export function getCardList () {
    return request({
        url: '/home/index',
        method: 'get'
    })
}

// 根据标签搜索组件
export function searchCard (params) {
    return request({
        url: '/home/getListByTag',
        method: 'get',
        params: params
    })
}

// 添加卡片组件
export function createCard (data) {
    return request({
        url: '/home/add',
        method: 'post',
        data: data
    })
}

// 修改卡片组件
export function updateCard (data) {
    return request({
        url: '/home/update',
        method: 'post',
        data: data
    })
}

// 批量修改卡片组件
export function updateAllCards (data) {
    return request({
        url: '/home/updateAll',
        method: 'post',
        data: data
    })
}

// 删除组件
export function deleteCard (id) {
    return request({
        url: '/home/delete',
        method: 'get',
        params: {
            id
        }
    })
}

// 获取(所有)页面
export function getPageList (params) {
    return request({
        url: '/home/getPages',
        method: 'get',
        params: params
    })
}

// 添加页面
export function addPage (pid, title) {
    return request({
        url: '/home/addPage',
        method: 'post',
        data: {
            projectId: pid,
            title: title || '未命名',
            pageText: '[]',
            background: '{}'
        }
    })
}

// 保存页面
export function savePage (data) {
    return request({
        url: '/home/updatePage',
        method: 'post',
        data: data
    })
}

// 删除页面
export function deletePage (id) {
    return request({
        url: '/home/deletePage',
        method: 'get',
        params: {
            id
        }
    })
}

// 上传文件
export function uploadFile (data) {
    return request({
        url: '/home/uploadFile',
        method: 'post',
        data: data
    })
}
