import Vue from 'vue'
import Router from 'vue-router'

import { auth } from '@/firebase'
import store from '@/store'

const CounterScreen = cb => require(['@/routes/CounterScreen.vue'], cb)
const DiceScreen = cb => require(['@/routes/DiceScreen.vue'], cb)
const StatisticsScreen = cb => require(['@/routes/StatisticsScreen.vue'], cb)
const SignIn = cb => require(['@/routes/SignIn.vue'], cb)
const SignUp = cb => require(['@/routes/SignUp.vue'], cb)
const LiveGame = cb => require(['@/routes/LiveGame.vue'], cb)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CounterScreen',
      component: CounterScreen,
      beforeEnter: (to, from, next) => { next(!store.state.liveGame.gameData) },
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
      beforeEnter: (to, from, next) => redirectIfAuth(to, from, next)
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: (to, from, next) => redirectIfAuth(to, from, next)
    },
    {
      path: '/live',
      name: 'LiveGame',
      component: LiveGame,
      beforeEnter: (to, from, next) => redirectIfNotAuth(to, from, next)
    }
  ]
})

// TODO: must always fire at the app launch
const addAuthChangeListener = () => new Promise((resolve, reject) => {
  console.warn('addAuthChangeListener')
  auth.onAuthStateChanged(firebaseUser => {
    store.dispatch('firebaseAuthenticate', firebaseUser)
    if (firebaseUser) resolve(true)
    else reject(false)
  })
})

const redirectIfNotAuth = (to, from, next) => {
  console.warn('redirectIfNotAuth')
  let signedIn = store.state.session.signedIn

  if (!store.state.session.firebaseAuthenticated) {
    console.warn('waiting...')
    addAuthChangeListener()
      .then(() => {
        console.log('ok')
        next()
      })
      .catch(() => {
        console.log('no')
        next(false)
      })
  } else {
    if (signedIn) console.log('ok')
    else console.log('no')
    next(signedIn)
  }
}

const redirectIfAuth = (to, from, next) => {
  console.warn('redirectIfAuth')
  let signedIn = store.state.session.signedIn

  if (!store.state.session.firebaseAuthenticated) {
    console.warn('waiting...')
    addAuthChangeListener()
      .then(() => {
        console.log('ok')
        next()
      })
      .catch(() => {
        console.log('no')
        next(false)
      })
  } else {
    if (!signedIn) console.log('ok')
    else console.log('no')
    next(!signedIn)
  }
}
