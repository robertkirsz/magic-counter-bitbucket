import Vue from 'vue'
import Router from 'vue-router'

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
      beforeEnter: (to, from, next) => { next(!store.state.session.signedIn) }
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: (to, from, next) => { next(!store.state.session.signedIn) }
    },
    {
      path: '/live',
      name: 'LiveGame',
      component: LiveGame,
      beforeEnter: (to, from, next) => { next(store.state.session.signedIn) }
    }
  ]
})
