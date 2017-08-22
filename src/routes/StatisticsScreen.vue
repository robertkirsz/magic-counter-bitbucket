<template>
  <transition
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
  >
    <backdrop>
      <div class="content" @click.stop>
        <h2>Statistics</h2>
      </div>
    </backdrop>
  </transition>
</template>

<script>
import Backdrop from '@/components/layout/Backdrop'

export default {
  name: 'StatisticsScreen',
  components: { Backdrop }
}
</script>

<style scoped>
</style>
