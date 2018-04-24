import * as http from './base'

const getOrderList = params => {
  return http.fetch('/orders', params)
}

const deleteOrderById = id => {
  return http.del(`/orders/${id}`)
}

const addOrder = params => {
  return http.post('/orders', params)
}

const updateOrder = (id, params) => {
  return http.put(`/orders/${id}`, params)
}

const getOrderByUserName = () => {
  return http.fetch('/getOrderByUserName')
}

export { getOrderList, addOrder, updateOrder, deleteOrderById, getOrderByUserName }
