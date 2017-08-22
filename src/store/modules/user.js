import Vue from 'vue'
import * as types from '@/store/mutation-types'

const getInitialState = () => ({
  uid: '',
  createdOn: null,
  lastLogin: null,
  displayName: '',
  email: '',
  photoURL: '',
  settings: {}
})

const state = getInitialState()

const getters = {
  getUser: state => ({
    id: state.uid,
    name: state.displayName || 'John Doe',
    picture: state.photoURL || 'https://placebear.com/100/100'
  })
}

const mutations = {
  [types.SAVE_USER] (state, user) {
    state.uid = user.uid
    state.displayName = user.displayName
    state.email = user.email
    state.photoURL = user.photoURL
    state.createdOn = user.createdOn
    state.lastLogin = user.lastLogin
    state.authRequestPending = false
    state.signedIn = true
  },
  [types.LOAD_USER_SETTINGS] (state, settings) {
    state.settings = settings
  },
  [types.SIGN_OUT_SUCCESS] (state) {
    const reset = getInitialState()
    for (let f in state) Vue.set(state, f, reset[f])
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
