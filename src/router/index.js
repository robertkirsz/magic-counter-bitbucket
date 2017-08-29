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
  routes: [
    {
      path: '/',
      name: 'CounterScreen',
      component: CounterScreen,
      beforeEnter: (to, from, next) => checkAuth(to, from, next),
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

// TODO: move somewhere else?
const addAuthChangeListener = () =>
  new Promise(resolve => {
    if (store.state.session.firebaseAuthenticated) {
      resolve(store.state.session.signedIn)
      return
    }

    log('beforeEnter: addAuthChangeListener request')
    auth.onAuthStateChanged(firebaseUser => {
      log('beforeEnter: addAuthChangeListener response')
      store.dispatch('firebaseAuthenticate', firebaseUser)
      resolve(!!firebaseUser)
    })
  })

const checkAuth = async (to, from, next) => {
  log(`beforeEnter: checkAuth - ${from.name} => ${to.name}`)
  await addAuthChangeListener()
  next()
}

const allowIfUnauth = async (to, from, next) => {
  log(`beforeEnter: allowIfUnauth - ${from.name} => ${to.name}`)
  next(await addAuthChangeListener())
}

const allowIfAuth = async (to, from, next) => {
  log(`beforeEnter: allowIfAuth - ${from.name} => ${to.name}`)
  next(!await addAuthChangeListener())
}
