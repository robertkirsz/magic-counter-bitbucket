<!--
  A main menu icon button
 -->

<template>
  <md-button
    v-if="!button.hidden"
    class="button md-icon-button"
    :class="{
      active: button.active,
      disabled: button.disabled
    }"
    @click.native="click"
  >
    <md-icon class="file" v-if="button.iconType === 'file'" :md-src="require(`../assets/${button.icon}`)" />
    <md-icon v-if="button.iconType === 'md'" v-text="button.icon" />
    <md-icon v-if="button.iconType === 'fa'" :md-iconset="button.icon" />
  </md-button>
</template>

<script>
export default {
  name: 'MainMenuButton',
  props: { button: { type: Object, required: true } },
  methods: {
    click (e) {
      if (!this.button.closeOnClick || this.button.disabled) e.stopPropagation()
      if (this.button.action && !this.button.disabled) this.button.action()
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-icon-button {
    margin: 0 !important;
    &.disabled .md-icon { opacity: 0.15; }
    &.active .md-icon { opacity: 1; }
  }
  .md-icon {
    opacity: 0.65;
    &.file { width: auto; min-width: 0; }
  }
</style>
