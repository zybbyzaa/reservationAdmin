import * as TYPES from '../mutation.types'

const state = {
  userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
}

const actions = {}

const mutations = {
  [TYPES.LOGIN]: (state, loginData) => {
    state.userInfo = loginData
    localStorage.setItem('userInfo', JSON.stringify(loginData))
  },
  [TYPES.LOGOUT]: state => {
    state.userInfo = {}
    localStorage.removeItem('userInfo')
  }
}

const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}
