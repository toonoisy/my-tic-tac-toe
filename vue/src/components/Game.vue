<script setup>
import Board from "./Board.vue";
import { calcWinner } from "./helpers";
import { ref, computed } from "vue";

const history = ref([{ squares: Array(9).fill(null), lastLocation: "" }]);
const stepNo = ref(0); //步数
const xIsNext = ref(true); // X 棋子先行
const status = ref('Next player: X');
const squares = computed(() => history.value[stepNo.value]?.squares);

function getStatus(squares) {
  const winnerIdx = calcWinner(squares);
  if (winnerIdx?.length) {
  const winner = squares[winnerIdx[0]];
  return `Winner ${winner}`;
  } else {
    if (stepNo.value === 9) {
      // 平局
      return "Let's settle for a draw";
    } else {
      return `Next player: ${xIsNext.value ? "X" : "O"}`;
    }
  }
}

function clickSquare(i) {
  const historySlice = history.value.slice(0, stepNo.value + 1);
  const current = historySlice[historySlice.length - 1];
  const squares = current.squares.slice();
  const winnerIdx = calcWinner(squares);
  // 已得出胜负或格子已被填充时不做操作
  if (!(winnerIdx || squares[i])) {
    // 轮流落子
    squares[i] = xIsNext.value ? "X" : "O";
    history.value = historySlice.concat([
      { squares, lastLocation: getLocation(i) },
    ]);
    stepNo.value = historySlice.length;
    xIsNext.value = !xIsNext.value;
  }
  status.value = getStatus(squares);
}

function getLocation(cellIdx) {
  const colNo = cellIdx % 3 + 1;
  const rowNo = Math.ceil((cellIdx + 1) / 3);
  return `(${colNo}, ${rowNo})`;
}

function jumpToMove(i) {
  stepNo.value = i;
  xIsNext.value = xIsNext % 2 === 0;
}
</script>

<template>
  <div class="game">
    <div class="game-board">
      <Board
        @clickSquare="clickSquare"
        :squares="squares"  
      />
    </div>
    <div class="game-info">
      <div>{{ status }}</div>
      <ol>
        <li
          :class="{ 'active': i === stepNo }"
          v-for="(e, i) in history"
          :key="e"
        >
          <button
            @click="jumpToMove(i)"
          >
            {{
              i 
                ?`Go to move #${i} ${history[i].lastLocation}`
                : 'Go to game start'
            }}
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
</style>