import moment from 'moment'
import _isNumber from 'lodash/isNumber'
import _first from 'lodash/first'
import _last from 'lodash/last'
import _includes from 'lodash/includes'
import _startsWith from 'lodash/startsWith'
import _reject from 'lodash/reject'
import * as types from '@/store/mutation-types'

/* EXAMPLE
error = {
  type: '',
  message: '',
  time: Moment,
  autohide: 1000
}
*/

const getInitialState = () => ({
  all: []
})

const state = getInitialState()

const getters = {
  errors: ({ all }) => all,
  anyErrors: ({ all }) => all.length > 0,
  firstError: ({ all }) => _first(all) || {},
  lastError: ({ all }) => _last(all) || {},
  // TODO: check wha two values below appear in Vue devtools store
  newestError: ({ all }) => moment.max(all.map(err => err.time)),
  oldestError: ({ all }) => moment.min(all.map(err => err.time)),
  errorsOfType: ({ all }) => (type) => all.filter(err => _startsWith(err.type, type)),
  firstErrorOfType: (state, { errorsOfType }) => (type) => errorsOfType(type)[0] || {},
  isEmailError: (state, { firstError }) => _includes(['auth/invalid-email', 'auth/email-already-in-use'], firstError.type),
  isPasswordError: (state, { firstError }) => _includes(['auth/wrong-password', 'auth/weak-password'], firstError.type)
}

const mutations = {
  [types.SHOW_ERROR] (state, error) {
    state.all.push({
      type: 'generic',
      time: moment(),
      message: '',
      ...error
    })
  },
  [types.HIDE_ERROR] (state) {
    state.all.shift()
  },
  [types.HIDE_ALL_ERRORS] (state) {
    state.all = []
  },
  [types.HIDE_ERRORS_OF_TYPE] (state, type) {
    state.all = _reject(state.all, error => _startsWith(error.type, type))
  }
}

const actions = {
  showError ({ commit }, error) {
    commit(types.SHOW_ERROR, error)

    // TODO: log errors in the database

    if (_isNumber(error.autohide)) {
      setTimeout(
        commit(types.HIDE_ERROR, error.type),
        error.autohide
      )
    }
  },
  hideError ({ commit }) {
    commit(types.HIDE_ERROR)
  },
  hideAllErrors ({ commit }) {
    commit(types.HIDE_ALL_ERRORS)
  },
  hideErrorsOfType ({ commit }, type) {
    commit(types.HIDE_ERRORS_OF_TYPE, type)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
