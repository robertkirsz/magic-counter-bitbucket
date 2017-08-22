<template>
  <div id="app">
    <router-view />
    <user-menu-button />
    <error-modal />
  </div>
</template>

<script>
// TODO: remove "Animated.css" when it's no longer needed
import { auth } from '@/firebase'
import UserMenuButton from '@/components/UserMenuButton'
import ErrorModal from '@/components/ErrorModal'

export default {
  name: 'App',
  components: { UserMenuButton, ErrorModal },
  mounted () {
    this.authChange()
  },
  methods: {
    authChange () {
      // When user's authentication status changes...
      auth.onAuthStateChanged(async (firebaseUser) => {
        this.$store.dispatch('firebaseAuthentication', firebaseUser)
      })
    }
  }
}
</script>

<style lang="scss">
  @import "./styles/animations";

  html,
  body {
    height: 100%;
  }

  * {
  	box-sizing: border-box;
  	user-drag: none;
  	user-select: none;
  	outline: none;
  	cursor: inherit;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
  }

  a,
  button {
    cursor: pointer;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    cursor: default;
    overflow: hidden;
  }
</style>
