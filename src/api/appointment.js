import request from '@/utils/request'

export function query(param) {
    return request({
        url: 'api/appointment/page',
        method: 'post',
        data: JSON.stringify(param)
    })
}

export function del(id) {
    return request({
        url: 'api/appointment/delete?id=' + id,
        method: 'delete'
    })
}

export function edit(data) {
    return request({
        url: 'api/appointment/operate',
        method: 'post',
        data
    })
}
export default { query, edit, del }
