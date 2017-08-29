import Vue from 'vue'
import _get from 'lodash/get'

import * as types from '@/store/mutation-types'
import { firebaseGetData, updateUserData, firebaseSignIn, firebaseSignUp, firebaseSignOut, firebaseProviderSignIn } from '@/firebase'

const debug = true

const getInitialState = () => ({
  // Requests
  signingIn: false,
  signingUp: false,
  signingOut: false,
  signingInProvider: false,
  signingInProviderName: '',
  firebaseAuthenticating: true,
  // Statuses
  signedIn: false,
  signedUp: false,
  signedOut: false,
  signedInProvider: false,
  signedInProviderName: '',
  firebaseAuthenticated: false
})

const state = getInitialState()

const getters = {
  authRequestPending: state => state.signingIn || state.signingUp || state.signingOut || state.signingInProvider
}

const mutations = {
  // Sign in
  [types.SIGN_IN_REQUEST] (state) {
    state.signingIn = true
  },
  [types.SIGN_IN_SUCCESS] (state) {
    state.signedIn = true
    state.signingIn = false
  },
  [types.SIGN_IN_FAIL] (state) {
    state.signedIn = false
    state.signingIn = false
  },
  // Sign up
  [types.SIGN_UP_REQUEST] (state) {
    state.signingUp = true
  },
  [types.SIGN_UP_SUCCESS] (state) {
    state.signedUp = true
    state.signingUp = false
  },
  [types.SIGN_UP_FAIL] (state) {
    state.signedUp = false
    state.signingUp = false
  },
  // Sign out
  [types.SIGN_OUT_REQUEST] (state) {
    state.signingOut = true
  },
  [types.SIGN_OUT_SUCCESS] (state) {
    const reset = {
      ...getInitialState(),
      firebaseAuthenticating: false,
      firebaseAuthenticated: true
    }
    for (let f in state) Vue.set(state, f, reset[f])
  },
  [types.SIGN_OUT_FAIL] (state) {
    state.signingOut = false
  },
  // Provider
  [types.SIGN_IN_PROVIDER_REQUEST] (state, providerName) {
    state.signingInProvider = true
    state.signingInProviderName = providerName
  },
  [types.SIGN_IN_PROVIDER_SUCCESS] (state) {
    state.signedIn = true
    state.signedInProvider = true
    state.signiedInProviderName = state.signingInProviderName
    state.signingInProvider = false
    state.signingInProviderName = ''
  },
  [types.SIGN_IN_PROVIDER_FAIL] (state) {
    state.signingInProvider = false
    state.signingInProviderName = ''
  },
  // Firebase authentication
  [types.FIREBASE_AUTHENTICATION_REQUEST] (state) {
    state.firebaseAuthenticating = true
  },
  [types.FIREBASE_AUTHENTICATION_RESPONSE] (state) {
    state.firebaseAuthenticating = false
    state.firebaseAuthenticated = true
  }
}

const actions = {
  async firebaseAuthenticate ({ commit, dispatch }, firebaseUser) {
    if (debug) console.info('Authentication state has changed')
    // Show spinner
    commit(types.FIREBASE_AUTHENTICATION_REQUEST)
    // Get currect time
    const now = Date.now()
    // If user's logged in...
    if (firebaseUser) {
      // Get user's from Firebase auth object
      const { uid, displayName, email, photoURL } = firebaseUser
      if (debug) console.info('User logged in as', displayName || email)
      // Get user's data from database
      const usersDataFromDatabase = await firebaseGetData('Users', uid)
      // Create empty user data object
      let user = {}
      // If user's data don't exists in database (this is his first time logging in)...
      if (!usersDataFromDatabase.success) {
        if (debug) console.info('No user data in the database')
        // Gather user's data from Firebase authentication
        user = {
          uid,
          displayName,
          email,
          photoURL,
          lastLogin: now,
          createdOn: now
        }
      } else {
        if (debug) console.info('Got user\'s data from the database')
        user = {
          ...usersDataFromDatabase.data,
          lastLogin: now
        }
      }

      // TODO: this is weird, need to rethink this
      // Save user's data in Firebase and in store
      const updateUserDataResponse = await updateUserData(user)

      if (updateUserDataResponse.success) {
        if (debug) console.info('User\'s data:', user)
        commit(types.UPDATE_USER_SUCCESS, user)
        commit(types.SIGN_IN_SUCCESS)
        // Fetch live game's data if user takes part in one
        if (user.liveGame) dispatch('joinLiveGame', user.liveGame)
      } else if (updateUserDataResponse.error) {
        commit(types.SHOW_ERROR, { type: 'firebase/auth', message: updateUserDataResponse.error })
      }

    // If user's not logged in or logged out...
    } else {
      // Log that into console
      if (debug) console.info('No user')
    }
    commit(types.FIREBASE_AUTHENTICATION_RESPONSE)
  },
  async signIn ({ commit, getters }, { email, password }) {
    // Return if request is pending
    if (getters.authRequestPending) return
    // Commit mutation so we can show spinner
    commit(types.SIGN_IN_REQUEST)
    // Sign the user in in Firebase
    const firebaseSignInResponse = await firebaseSignIn(email, password)
    // If we got error, display it
    if (firebaseSignInResponse.error) {
      commit(types.SIGN_IN_FAIL)
      commit(types.SHOW_ERROR, {
        type: firebaseSignInResponse.response.code,
        message: firebaseSignInResponse.response.message
      })
    } else {
      commit(types.SIGN_IN_SUCCESS)
      commit(types.HIDE_ERRORS_OF_TYPE, 'auth/')
    }
  },
  async signUp ({ commit, getters }, { email, password }) {
    // Return if request is pending
    if (getters.authRequestPending) return
    // Commit mutation so we can show spinner
    commit(types.SIGN_UP_REQUEST)
    // Sign the user up in Firebase
    const firebaseSignUpResponse = await firebaseSignUp(email, password)
    // If we got error, display it
    if (firebaseSignUpResponse.error) {
      commit(types.SIGN_UP_FAIL)
      commit(types.SHOW_ERROR, {
        type: firebaseSignUpResponse.response.code,
        message: firebaseSignUpResponse.response.message
      })
    } else {
      commit(types.SIGN_UP_SUCCESS)
      commit(types.HIDE_ERRORS_OF_TYPE, 'auth/')
    }
  },
  async signOut ({ commit, getters }) {
    // Return if request is pending
    if (getters.authRequestPending) return
    // Commit mutation so we can show spinner
    commit(types.SIGN_OUT_REQUEST)
    // Sign user out of Firebase
    const firebaseSignOutResponse = await firebaseSignOut()
    // Display errors if we get any
    if (firebaseSignOutResponse.error) {
      commit(types.SHOW_ERROR, {
        type: 'generic',
        message: `There was a problem while signing out. This is what we know: ${firebaseSignOutResponse.error}`
      })
    } else {
      commit(types.SIGN_OUT_SUCCESS)
    }
  },
  async signInWithProvider ({ commit, getters }, { providerName }) {
    // Return if request is pending
    if (getters.authRequestPending) return
    // Commit mutation so we can show spinner
    commit(types.SIGN_IN_PROVIDER_REQUEST, providerName)
    // Sign in via provider
    const firebaseSignInResponse = await firebaseProviderSignIn(providerName)
    // Display errors if we get any
    if (firebaseSignInResponse.error) {
      commit(types.SIGN_IN_PROVIDER_FAIL)
      commit(types.SHOW_ERROR, {
        type: _get(firebaseSignInResponse, 'response.code', 'generic'),
        message: _get(firebaseSignInResponse, 'response.message', firebaseSignInResponse.error)
      })
    } else {
      commit(types.SIGN_IN_PROVIDER_SUCCESS)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
