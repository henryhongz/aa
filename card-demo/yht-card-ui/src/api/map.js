// 获取企业属性列表
import localRequest from "../libs/localRequest";
import remoteRequest from "../libs/remoteRequest";

// 获取园区列表(位置等信息)
export function getParkList () {
    return localRequest({
        url: '/json/parkList.json',
        method: 'get'
    })
}

// 获取城市边界GeoJSON
export function getCityGeo (cityCode = 330212) {
    return remoteRequest({
        url: '/data_interface/getMapJsonInfo',
        method: 'get',
        params: {
            code: cityCode
        }
    })
}
