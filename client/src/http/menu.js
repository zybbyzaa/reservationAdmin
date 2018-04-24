import * as http from './base'

const getMenuList = params => {
  return http.fetch('/menus', params)
}

const deleteMenuById = id => {
  return http.del(`/menus/${id}`)
}

const addMenu = params => {
  return http.post('/menus', params)
}

const updateMenu = (id, params) => {
  return http.put(`/menus/${id}`, params)
}

export { getMenuList, addMenu, updateMenu, deleteMenuById }
