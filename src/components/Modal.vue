<template>
  <transition name="modal">
    <div
      class="modal-background"
      :class="{ error, center }"
      @click="$emit('close')"
    >
      <div class="modal-container" @click.stop>

        <div class="modal-header">
          <slot name="header">
            Default header
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            Default body
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <md-button
              class="md-raised"
              :class="buttonClassName"
              @click.native="$emit('close')"
              v-text="'Ok'"
            />
          </slot>
        </div>

      </div>

    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    error: Boolean,
    center: Boolean
  },
  destroyed () {
    this.$emit('closed')
  },
  computed: {
    buttonClassName () {
      return this.error ? 'md-accent' : 'md-primary'
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  &-background {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 9999;
    transition: opacity .3s ease;
    &.error { background: rgba(200, 0, 0, .5); }
    &.center * { text-align: center; }
  }
  &-container {
    width: 300px;
    margin: auto;
    padding: 16px;
    background-color: white;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s;
  }
  &-body {
    margin: 16px 0;
    padding: 0 8px;
  }

  // ANIMATIONS
  &-enter,
  &-leave-active { opacity: 0; }
  &-enter &-container,
  &-leave-active &-container { transform: scale(1.1); }
}
</style>
