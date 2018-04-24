import * as http from './base'

const getRoleList = params => {
  return http.fetch('/roles', params)
}

const deleteRoleById = id => {
  return http.del(`/roles/${id}`)
}

const addRole = params => {
  return http.post('/roles', params)
}

const updateRole = (id, params) => {
  return http.put(`/roles/${id}`, params)
}

export { getRoleList, addRole, updateRole, deleteRoleById }
