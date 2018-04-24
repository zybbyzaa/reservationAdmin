import * as http from './base'

const checkLogin = () => {
  return http.fetch('/auth/checkLogin')
}

const login = data => {
  return http.post('/auth/login', data)
}

const getUserList = params => {
  return http.fetch('/users', params)
}
const getUser = id => {
  return http.fetch(`/users/${id}`)
}

const deleteUserById = id => {
  return http.del(`/users/${id}`)
}

const addUser = params => {
  return http.post('/users', params)
}

const updateUser = (id, params) => {
  return http.put(`/users/${id}`, params)
}

export {
  checkLogin,
  login,
  getUser,
  getUserList,
  deleteUserById,
  addUser,
  updateUser
}
