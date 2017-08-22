<template>
  <modal v-if="error.message"
    error
    center
    @close="close"
  >
    <md-icon
      slot="header"
      class="md-accent md-size-2x"
      v-text="'error_outline'"
    />
    <p slot="body" v-text="error.message" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'

export default {
  name: 'ErrorModal',
  components: { Modal },
  computed: {
    error () {
      return this.$store.getters.firstErrorOfType('generic')
    }
  },
  methods: {
    close () {
      this.$store.dispatch('hideError')
    }
  }
}
</script>
