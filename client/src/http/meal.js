import * as http from './base'

const getMealList = params => {
  return http.fetch('/meals', params)
}

const deleteMealById = id => {
  return http.del(`/meals/${id}`)
}

const addMeal = params => {
  return http.post('/meals', params)
}

const updateMeal = (id, params) => {
  return http.put(`/meals/${id}`, params)
}

const getLastestMealList = () => {
  return http.fetch('/getMealslastest')
}

export { getMealList, addMeal, updateMeal, deleteMealById, getLastestMealList }
