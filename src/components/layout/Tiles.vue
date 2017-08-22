<!--
  This component creates a space for each player
-->

<template>
  <div class="tiles">
    <template v-for="(item, index) in items">
      <tile>
        <slot name="item" :item="item" :index="index" />
      </tile>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tile from '@/components/layout/Tile'

export default {
  name: 'Tiles',
  props: ['items'],
  components: { Tile },
  computed: mapGetters(['numberOfPlayers'])
}
</script>

<style scoped>
  .tiles {
    flex: 1;
    display: flex;
    flex-flow: column-reverse wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>
