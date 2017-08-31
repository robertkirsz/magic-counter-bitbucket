import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'
import { auth } from '@/firebase'
import { log } from '@/utils'

const CounterScreen = cb => require(['@/routes/CounterScreen.vue'], cb)
const DiceScreen = cb => require(['@/routes/DiceScreen.vue'], cb)
const StatisticsScreen = cb => require(['@/routes/StatisticsScreen.vue'], cb)
const SignIn = cb => require(['@/routes/SignIn.vue'], cb)
const SignUp = cb => require(['@/routes/SignUp.vue'], cb)
const LiveGame = cb => require(['@/routes/LiveGame.vue'], cb)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'CounterScreen',
      component: CounterScreen,
      beforeEnter: (to, from, next) => authenticate(to, from, next),
      children: [
        {
          path: 'dice',
          name: 'DiceScreen',
          component: DiceScreen
        },
        {
          path: 'statistics',
          name: 'StatisticsScreen',
          component: StatisticsScreen
        }
      ]
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn,
      beforeEnter: (to, from, next) => allowIfAuth(to, from, next)
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: (to, from, next) => allowIfAuth(to, from, next)
    },
    {
      path: '/live',
      name: 'LiveGame',
      component: LiveGame,
      beforeEnter: (to, from, next) => allowIfUnauth(to, from, next)
    }
  ]
})

// Makes sure the user is authenticated
const authenticate = async (to, from, next) => {
  log(`beforeEnter: authenticate - ${from.name} => ${to.name}`)
  await checkAuth()
  next()
}

// Allows only not logged-in users
const allowIfUnauth = async (to, from, next) => {
  log(`beforeEnter: allowIfUnauth - ${from.name} => ${to.name}`)
  next(await checkAuth())
}

// Allows only logged-in users
const allowIfAuth = async (to, from, next) => {
  log(`beforeEnter: allowIfAuth - ${from.name} => ${to.name}`)
  next(!await checkAuth())
}

// Returns user's sign-in status
const checkAuth = () => new Promise(resolve => {
  log('beforeEnter: checkAuth')
  // Check if authentication process was already done
  if (store.state.session.firebaseAuthenticated) {
    // If yes, then return user's sign-in status
    resolve(store.state.session.signedIn)
    return
  }
  // If authentication was now done already - do it now
  addAuthListener().then(resolve)
})

// Adds Firebase authentication listener
const addAuthListener = () => new Promise(resolve => {
  log('beforeEnter: addAuthListener')
  auth.onAuthStateChanged(firebaseUser => {
    store.dispatch('firebaseAuthenticate', firebaseUser)
    resolve(!!firebaseUser)
  })
})
