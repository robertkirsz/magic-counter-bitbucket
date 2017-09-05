<template>
  <div id="app">
    <spinner-handler />
    <router-view />
    <user-menu-button />
    <error-modal />
    <redirector />
  </div>
</template>

<script>
import UserMenuButton from '@/components/UserMenuButton'
import SpinnerHandler from '@/components/SpinnerHandler'
import Redirector from '@/components/Redirector'

const ErrorModal = cb => require(['@/components/ErrorModal.vue'], cb)

export default {
  name: 'App',
  components: { UserMenuButton, ErrorModal, SpinnerHandler, Redirector }
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
