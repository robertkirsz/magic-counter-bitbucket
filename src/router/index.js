import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import CounterScreen from '@/routes/CounterScreen'
import DiceScreen from '@/routes/DiceScreen'
import StatisticsScreen from '@/routes/StatisticsScreen'
import SignIn from '@/routes/SignIn'
import SignUp from '@/routes/SignUp'
import LiveGame from '@/routes/LiveGame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CounterScreen',
      component: CounterScreen,
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
      component: SignIn
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/live',
      name: 'LiveGame',
      component: LiveGame,
      beforeEnter: (to, from, next) => {
        next(store.state.session.signedIn)
      }
    }
  ]
})
