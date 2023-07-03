<script setup>
import Square from "./Square.vue";
import { computed } from "vue";
import { calcWinner } from "./helpers";

defineEmits(["clickSquare"]);
const props = defineProps({
  squares: Array,
});

const winnerIdx = computed(() => calcWinner(props.squares));

const board = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];
</script>

<template>
  <div class="board-row" v-for="(row, i) in board" :key="i">
    <Square
      v-for="cell in row"
      :class="{ highlight: winnerIdx?.includes(cell) }"
      :key="cell"
      :value="squares[cell]"
      @click="$emit('clickSquare', cell)"
    />
  </div>

  <!-- <div class="board-row" v-for="i in 3" :key="i">
    <Square
      v-for="j in 3"
      :class="{ highlight: winnerIdx?.includes(3 * (i - 1) + (j - 1)) }"
      :key="3 * (i - 1) + (j - 1)"
      :value="squares[3 * (i - 1) + (j - 1)]"
      @click="$emit('clickSquare', 3 * (i - 1) + (j - 1))"
    />
  </div> -->
</template>

<style scoped>
</style>