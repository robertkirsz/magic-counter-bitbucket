<template>
  <md-input-container
    md-has-password
    :class="{'md-input-invalid': showError }"
  >
    <label>Password</label>
    <md-input
      type="password"
      v-bind:value="value"
      v-on:input="updateValue"
    />
    <span class="md-error">{{ errorMessage }}</span>
  </md-input-container>
</template>

<script>
export default {
  name: 'PasswordInput',
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
