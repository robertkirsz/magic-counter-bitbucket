import Vue from 'vue'

import { firebaseUpdateData } from '@/firebase'
import * as types from '@/store/mutation-types'

const getInitialState = () => ({
  uid: null,
  displayName: null,
  email: null,
  photoURL: null,
  createdOn: null,
  updatedOn: null,
  lastLogin: null,
  settings: null,
  liveGame: null
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
  [types.UPDATE_USER_REQUEST] () {},
  [types.UPDATE_USER_SUCCESS] (state, user) {
    for (let f in state) {
      if (user[f] !== undefined) Vue.set(state, f, user[f])
    }
  },
  [types.UPDATE_USER_FAIL] () {},
  [types.SIGN_OUT_SUCCESS] (state) {
    const reset = getInitialState()
    for (let f in state) Vue.set(state, f, reset[f])
  }
}

const actions = {
  async updateUser ({ commit, state }, data) {
    commit(types.UPDATE_USER_REQUEST)

    const user = {
      ...state,
      ...data,
      updatedOn: Date.now()
    }

    const updateUserResponse = await firebaseUpdateData('Users', user.uid, user)

    if (updateUserResponse.success) {
      commit(types.UPDATE_USER_SUCCESS, user)
    } else if (updateUserResponse.error) {
      commit(types.UPDATE_USER_FAIL)
      commit(types.SHOW_ERROR, { type: 'user/update', message: updateUserResponse.error })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
