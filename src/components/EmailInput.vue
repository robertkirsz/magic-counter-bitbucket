<template>
  <md-input-container :class="{'md-input-invalid': showError }">
    <label>Email</label>
    <md-input
      type="email"
      v-bind:value="value"
      v-on:input="updateValue"
    />
    <span class="md-error">{{ errorMessage }}</span>
  </md-input-container>
</template>

<script>
export default {
  name: 'EmailInput',
  props: {
    value: String,
    showError: Boolean,
    errorMessage: String
  },
  methods: {
    updateValue (value) {
      this.$emit('input', value)
    }
  }
}
</script>
