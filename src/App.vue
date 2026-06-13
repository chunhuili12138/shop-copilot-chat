<template>
  <div id="app">
    <ChatWindow />
  </div>
</template>

<script setup lang="ts">
import ChatWindow from './components/ChatWindow.vue'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
