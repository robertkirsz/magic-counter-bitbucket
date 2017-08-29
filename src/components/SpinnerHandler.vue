<template>
  <transition name="spinner-transition">
    <div v-if="loading" class="spinner-overlay" :class="className">
      <md-spinner md-indeterminate />
    </div>
  </transition>
</template>

<script>

export default {
  name: 'SpinnerHandler',
  computed: {
    firebaseAuthenticating () { return this.$store.state.session.firebaseAuthenticating },
    signingIn () { return this.$store.state.session.signingIn },
    signingUp () { return this.$store.state.session.signingUp },
    signingInProvider () { return this.$store.state.session.signingInProvider },
    loading () { return this.firebaseAuthenticating || this.signingIn || this.signingUp || this.signingInProvider },
    semi () { return this.signingIn || this.signingUp || this.signingInProvider },
    opaque () { return this.firebaseAuthenticating },
    className () { return { opaque: this.opaque, semi: this.semi } }
  }
}
</script>

<style lang="scss" scoped>
.spinner-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index: 1000;
  transition: opacity .3s;
  &.opaque { background: white; }
  &.semi { background: rgba(white, 0.75); }

  .md-spinner {
    transform: scale(1);
    transition: transform .3s;
  }
}

.spinner-transition-enter,
.spinner-transition-leave-active {
  opacity: 0;
  & .md-spinner {
    transform: scale(0);
  }
}
</style>
