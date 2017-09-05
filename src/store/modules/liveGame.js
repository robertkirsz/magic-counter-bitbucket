import Vue from 'vue'

import * as types from '@/store/mutation-types'
import { firebaseGetData, firebaseSetData, firebaseUpdateData, addFirebaseListener, removeFirebaseListener } from '@/firebase'

const getInitialState = () => ({
  // Requests
  creating: false,
  joining: false,
  destroying: false,
  leaving: false,
  // Data
  name: null,
  owner: {},
  players: [],
  createdAt: null
})

const state = getInitialState()

const getters = {
  isLiveGame: (state, getters) => state.name !== null,
  // gameData: state => ({ name: state.name, owner: state.owner, players: state.players }),
  userIsOwner: (state, getters, rootState, rootGetters) => state.owner.id === rootGetters.getUser.id,
  userLivePlayer: (state, getters, rootState, rootGetters) => state.players.find(player => player.id === rootGetters.getUser.id),
  userLivePlayerIndex: (state, getters, rootState, rootGetters) => state.players.findIndex(player => player.id === rootGetters.getUser.id),
  otherLivePlayers: (state, getters, rootState, rootGetters) => state.players.filter(player => player.id !== rootGetters.getUser.id)
}

const mutations = {
  // Create game
  [types.CREATE_LIVE_GAME_REQUEST] (state) {
    state.creating = true
  },
  [types.CREATE_LIVE_GAME_SUCCESS] (state) {
    state.creating = false
  },
  [types.CREATE_LIVE_GAME_FAIL] (state) {
    state.creating = false
  },
  // Join game
  [types.JOIN_LIVE_GAME_REQUEST] (state) {
    state.joining = true
  },
  [types.JOIN_LIVE_GAME_SUCCESS] (state) {
    state.joining = false
  },
  [types.JOIN_LIVE_GAME_FAIL] (state) {
    state.joining = false
  },
  // Destroy game
  [types.DESTROY_LIVE_GAME_REQUEST] (state) {
    state.destroying = true
  },
  [types.DESTROY_LIVE_GAME_SUCCESS] (state) {
    const reset = getInitialState()
    for (let f in state) Vue.set(state, f, reset[f])
  },
  [types.DESTROY_LIVE_GAME_FAIL] (state) {
    state.destroying = false
  },
  // Leave game
  [types.LEAVE_LIVE_GAME_REQUEST] (state) {
    state.leaving = true
  },
  [types.LEAVE_LIVE_GAME_SUCCESS] (state) {
    const reset = getInitialState()
    for (let f in state) Vue.set(state, f, reset[f])
  },
  [types.LEAVE_LIVE_GAME_FAIL] (state) {
    state.leaving = false
  },
  // Listener
  [types.SYNC_LIVE_GAME] (state, game) {
    if (!game) {
      const reset = getInitialState()
      for (let f in state) Vue.set(state, f, reset[f])
      return
    }

    state.name = game.name
    state.owner = game.owner
    state.players = game.players
    state.createdAt = game.createdAt
  }
}

const actions = {
  async createLiveGame ({ commit, getters, dispatch }, gameName) {
    // Stop if user already is taking part in a live game
    if (getters.isLiveGame) return

    // Start request
    commit(types.CREATE_LIVE_GAME_REQUEST)

    // Check if game with that name already exists in the database
    const existingGame = await firebaseGetData('LiveGames', gameName)

    // If yes, show error and stop
    if (existingGame.success) {
      commit(types.CREATE_LIVE_GAME_FAIL)
      commit(types.SHOW_ERROR, { message: 'Game with that name already exists' })
      return
    }

    // Prepare game data
    const gameData = {
      name: gameName,
      owner: getters.getUser,
      players: [{ ...getters.getUser, life: 20 }],
      createdAt: Date.now()
    }

    // Add game data to the database
    await firebaseSetData('LiveGames', gameName, gameData)
      // Finish request
      .then(response => {
        commit(types.CREATE_LIVE_GAME_SUCCESS, response)
        // TODO: do this on the server?
        dispatch('updateUser', { liveGame: gameName })
      })
      // Show error if thrown
      .catch(error => {
        commit(types.CREATE_LIVE_GAME_FAIL)
        commit(types.SHOW_ERROR, { message: 'Error while creating a game: ' + error })
      })

    // Add database listener on that game data
    dispatch('addLiveGameListener', gameName)
  },
  async joinLiveGame ({ commit, getters, dispatch, rootState }, gameName) {
    // Stop if user already is taking part in a live game
    if (getters.isLiveGame) return

    // Start request
    commit(types.JOIN_LIVE_GAME_REQUEST)

    // Check if game with that name exists in the database
    const existingGame = await firebaseGetData('LiveGames', gameName)

    // If no, show error and stop
    if (existingGame.error) {
      commit(types.JOIN_LIVE_GAME_FAIL)
      if (rootState.user.liveGame) {
        commit(types.SHOW_ERROR, { message: `Game ${gameName} no longer exists` })
        dispatch('updateUser', { liveGame: null })
      } else {
        commit(types.SHOW_ERROR, { message: `Game ${gameName} not found` })
      }
      return
    }

    // Find player's data in the players array
    const playerInGameAlready = !!existingGame.data.players.find(player => player.id === getters.getUser.id)
    // If it exists, do nothing. If not, add user to the players array
    const players = playerInGameAlready
      ? [...existingGame.data.players]
      : [...existingGame.data.players, { ...getters.getUser, life: 20 }]
      // Prepare game data
    const gameData = { ...existingGame.data, players }

    // Update game data in the database
    await firebaseUpdateData('LiveGames', gameName, gameData)
      // Finish request
      .then(response => {
        commit(types.JOIN_LIVE_GAME_SUCCESS, response)
        // TODO: do this on the server?
        if (!playerInGameAlready) dispatch('updateUser', { liveGame: gameName })
      })
      // Show error if thrown
      .catch(error => {
        commit(types.JOIN_LIVE_GAME_FAIL)
        commit(types.SHOW_ERROR, { message: 'Error while joining the game: ' + error })
      })

    // Add database listener on that game data
    dispatch('addLiveGameListener', gameName)
  },
  async destroyLiveGame ({ commit, state, getters, dispatch }) {
    // Stop if there is no game data or if the user is not that game's owner
    if (!getters.isLiveGame || !getters.userIsOwner) return

    commit(types.DESTROY_LIVE_GAME_REQUEST)
    await removeFirebaseListener('LiveGames', state.name)
    await firebaseSetData('LiveGames', state.name, null)
    commit(types.DESTROY_LIVE_GAME_SUCCESS)
    // TODO: do this on the server?
    dispatch('updateUser', { liveGame: null })
  },
  leaveLiveGame ({ commit, state, getters, dispatch, rootGetters }) {
    // Stop if there is no game data or if the user is that game's owner
    if (!getters.isLiveGame || getters.userIsOwner) return

    // Start request
    commit(types.LEAVE_LIVE_GAME_REQUEST)

    // Prepare game data (remove user from the "players" array)
    const gameData = {
      players: state.players.filter(p => p.id !== rootGetters.getUser.id)
    }

    // Update game data in the database
    firebaseUpdateData('LiveGames', state.name, gameData)
      // Finish request
      .then(async response => {
        await removeFirebaseListener('LiveGames', state.name)
        commit(types.LEAVE_LIVE_GAME_SUCCESS, response)
        // TODO: do this on the server?
        dispatch('updateUser', { liveGame: null })
      })
      // Show error if thrown
      .catch(error => {
        commit(types.LEAVE_LIVE_GAME_FAIL)
        commit(types.SHOW_ERROR, { message: 'Error while leaving a game: ' + error })
      })
  },
  addLiveGameListener ({ commit, dispatch }, gameName) {
    addFirebaseListener('LiveGames', gameName, async data => {
      commit(types.SYNC_LIVE_GAME, data)

      if (!data) {
        await removeFirebaseListener('LiveGames', gameName)
        dispatch('updateUser', { liveGame: null })
      }
    })
  },
  increaseLivePlayerLife ({ state, getters }, amount = 1) {
    const index = getters.userLivePlayerIndex
    const player = { ...getters.userLivePlayer }
    const players = [...state.players]

    player.life += amount
    players.splice(index, 1, player)

    // TODO: debounce this
    firebaseUpdateData('LiveGames', state.name, { players })
  },
  decreaseLivePlayerLife ({ commit, getters }, amount = 1) {
    const index = getters.userLivePlayerIndex
    const player = { ...getters.userLivePlayer }
    const players = [...state.players]

    player.life -= amount
    players.splice(index, 1, player)

    // TODO: debounce this
    firebaseUpdateData('LiveGames', state.name, { players })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
