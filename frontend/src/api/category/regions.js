import axios from '@/libs/api.request'

const RegionUrl = '/api/category/regions/'

export const GetRegionList = (params) => {
  return axios.request({
    url: RegionUrl,
    method: 'get',
    params: params
  })
}

export const GetRegion = (id) => {
  return axios.request({
    url: RegionUrl + id + '/',
    method: 'get'
  })
}

export const CreateRegion = (data) => {
  return axios.request({
    url: RegionUrl,
    method: 'post',
    data: data
  })
}

export const UpdateRegion = (id, data) => {
  return axios.request({
    url: RegionUrl + id + '/',
    method: 'put',
    data: data
  })
}

export const DeleteRegion = (id) => {
  return axios.request({
    url: RegionUrl + id + '/',
    method: 'delete'
  })
}
