<template>
  <div class="social-buttons">
    <md-button
      v-for="button in buttons"
      :key="button.value"
      class="md-raised md-primary"
      :style="{ backgroundColor: button.color }"
      @click.native="$emit('providerChosen', button.value)"
    >
      <md-icon :md-iconset="`fa fa-${button.value}`" />
      {{ button.label }}
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'SocialButtons',
  computed: {
    buttons () {
      return [
        { value: 'facebook', label: 'Facebook', color: '#3b5998' },
        { value: 'google', label: 'Google', color: '#ea4335' },
        { value: 'twitter', label: 'Twitter', color: '#1da1f2' },
        { value: 'github', label: 'GitHub', color: '#24292e' }
      ]
    }
  }
}
</script>
