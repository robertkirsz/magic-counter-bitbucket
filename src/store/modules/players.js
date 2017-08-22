import Vue from 'vue'
import * as types from '@/store/mutation-types'

// TODO: when number of players changes, clear commander
// damage dealt by players that left the game

const commanderDamage = () => ({ 1: 0, 2: 0, 3: 0, 4: 0 })

const getInitialState = () => ([
  { id: 1, life: 20, backupLife: 40, color: '', poison: 0, commanderDamage: commanderDamage() },
  { id: 2, life: 20, backupLife: 40, color: '', poison: 0, commanderDamage: commanderDamage() }
])

const state = {
  all: getInitialState()
}

const getters = {
  players: ({ all }) => all,
  getPlayer: (state, { players }) => id => players.find(player => player.id === id),
  getPlayerIndex: (state, { players }) => id => players.findIndex(player => player.id === id),
  otherPlayers: (state, { players }) => id => players.filter(player => player.id !== id),
  numberOfPlayers: (state, { players }) => players.length,
  noPlayers: (state, { numberOfPlayers }) => numberOfPlayers === 0,
  lastPlayerIndex: (state, { numberOfPlayers }) => numberOfPlayers - 1,
  playersColors: (state, { players }) => players.map(player => player.color),
  divider: (state, { numberOfPlayers }) => Math.ceil(numberOfPlayers / 2) || 1
}

const mutations = {
  [types.START_NEW_GAME] (state) {
    Vue.set(state, 'all', getInitialState())
  },
  [types.RESET_CURRENT_GAME] (state, { commanderGame }) {
    const resettedState = state.all.map(player => ({
      ...player,
      life: commanderGame ? 40 : 20,
      backupLife: commanderGame ? 20 : 40,
      poison: 0,
      commanderDamage: commanderDamage()
    }))

    Vue.set(state, 'all', resettedState)
  },
  [types.SHOW_COMMANDER_COUNTERS] (state) {
    const resettedState = state.all.map(player => ({
      ...player,
      life: player.backupLife,
      backupLife: player.life
    }))

    Vue.set(state, 'all', resettedState)
  },
  [types.HIDE_COMMANDER_COUNTERS] (state) {
    const resettedState = state.all.map(player => ({
      ...player,
      life: player.backupLife,
      backupLife: player.life
    }))

    Vue.set(state, 'all', resettedState)
  },
  [types.ADD_PLAYER] ({ all }, player) {
    all.push(player)
  },
  [types.REMOVE_PLAYER] ({ all }) {
    all.pop()
  },
  [types.INCREASE_LIFE] ({ all }, { index, player, amount }) {
    player.life += amount
    all.splice(index, 1, player)
  },
  [types.DECREASE_LIFE] ({ all }, { index, player, amount }) {
    player.life -= amount
    all.splice(index, 1, player)
  },
  [types.ADD_POISON_COUNTER] ({ all }, { index, player, amount }) {
    player.poison += amount
    all.splice(index, 1, player)
  },
  [types.REMOVE_POISON_COUNTER] ({ all }, { index, player, amount }) {
    player.poison -= amount
    all.splice(index, 1, player)
  },
  [types.ADD_COMMANDER_DAMAGE] ({ all }, { player, index, commanderId, amount }) {
    player.commanderDamage[commanderId] += amount
    player.life -= amount
    all.splice(index, 1, player)
  },
  [types.REMOVE_COMMANDER_DAMAGE] ({ all }, { player, index, commanderId, amount }) {
    const commanderDamage = player.commanderDamage[commanderId]

    if (commanderDamage - amount < 0) {
      player.life += commanderDamage
      player.commanderDamage[commanderId] = 0
    } else {
      player.life += amount
      player.commanderDamage[commanderId] -= amount
    }

    all.splice(index, 1, player)
  },
  [types.CHOOSE_COLOR] ({ all }, { index, player, color }) {
    player.color = color
    all.splice(index, 1, player)
  }
}

const actions = {
  addPlayer ({ commit, getters }) {
    if (getters.numberOfPlayers < 4) {
      const player = {
        id: getters.numberOfPlayers + 1,
        life: getters.commanderGame ? 40 : 20,
        backupLife: getters.commanderGame ? 20 : 40,
        color: '',
        poison: 0,
        commanderDamage: commanderDamage()
      }

      commit(types.ADD_PLAYER, player)
    }
  },
  removePlayer ({ commit, getters }) {
    if (getters.numberOfPlayers > 0) {
      commit(types.REMOVE_PLAYER)
    }
  },
  increaseLife ({ commit, getters }, id, amount = 1) {
    const player = getters.getPlayer(id)
    const index = getters.getPlayerIndex(id)
    commit(types.INCREASE_LIFE, { index, player, amount })
  },
  decreaseLife ({ commit, getters }, id, amount = 1) {
    const player = getters.getPlayer(id)
    const index = getters.getPlayerIndex(id)
    commit(types.DECREASE_LIFE, { index, player, amount })
  },
  addPoisonCounter ({ commit, getters }, id, amount = 1) {
    const player = getters.getPlayer(id)
    const index = getters.getPlayerIndex(id)
    commit(types.ADD_POISON_COUNTER, { index, player, amount })
  },
  removePoisonCounter ({ commit, getters }, id, amount = 1) {
    const player = getters.getPlayer(id)
    const index = getters.getPlayerIndex(id)
    if (player.poison === 0) return
    commit(types.REMOVE_POISON_COUNTER, { index, player, amount })
  },
  addCommanderDamage ({ commit, getters }, { id, amount = 1, commanderId }) {
    const player = getters.getPlayer(id)
    const index = getters.getPlayerIndex(id)
    commit(types.ADD_COMMANDER_DAMAGE, { player, index, commanderId, amount })
  },
  removeCommanderDamage ({ commit, getters }, { id, amount = 1, commanderId }) {
    const player = getters.getPlayer(id)
    if (player.commanderDamage[commanderId] === 0) return
    const index = getters.getPlayerIndex(id)
    const payload = { player, index, commanderId, amount }
    commit(types.REMOVE_COMMANDER_DAMAGE, payload)
  },
  chooseColor ({ commit, getters }, { id, color }) {
    const player = getters.getPlayer(id)
    const index = getters.getPlayerIndex(id)
    commit(types.CHOOSE_COLOR, { index, player, color })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
