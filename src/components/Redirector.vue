<template>
  <div />
</template>

<script>
import { log } from '@/utils'
import { mapState } from 'vuex'

export default {
  name: 'Redirector',
  computed: {
    ...mapState({
      liveGame: state => state.liveGame.gameData,
      userSignedIn: state => state.session.signedIn
    })
  },
  methods: {
    go (name, message) {
      if (this.$route.name !== name) {
        log(`Redirector - ${message} => ${name}`)
        this.$router.push({ name })
      }
    }
  },
  watch: {
    userSignedIn (next, prev) {
      if (prev && !next) this.go('SignIn', 'user logged-out')
    },
    liveGame (next, prev) {
      if (!prev && next) this.go('LiveGame', 'liveGame data added')
    }
  }
}
</script>

<style scoped>
  div { display: none; }
</style>
