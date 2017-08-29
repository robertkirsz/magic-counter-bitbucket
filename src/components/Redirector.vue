<template>
  <div />
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { log } from '@/utils'

export default {
  name: 'Redirector',
  computed: {
    ...mapGetters(['isLiveGame']),
    ...mapState({ userSignedIn: state => state.session.signedIn })
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
    isLiveGame (next, prev) {
      if (!prev && next) this.go('LiveGame', 'live game added')
    }
  }
}
</script>

<style scoped>
  div { display: none; }
</style>
