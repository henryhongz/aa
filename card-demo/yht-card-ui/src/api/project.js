import request from '../libs/request'

// 获取项目列表
export function getProjectList () {
    return request({
        url: '/home/getProjects',
        method: 'get'
    })
}

// 创建项目
export function addProject (name) {
    return request({
        url: '/home/addProject',
        method: 'post',
        data: {
            projectName: name || '未命名'
        }
    })
}

// 修改项目
export function editProject (data) {
    return request({
        url: '/home/updateProject',
        method: 'post',
        data: data
    })
}

// 删除项目
export function deleteProject (id) {
    return request({
        url: '/home/deleteProject',
        method: 'get',
        params: {
            id: id
        }
    })
}
