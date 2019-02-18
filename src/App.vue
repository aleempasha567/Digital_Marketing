<template>
  <div id="app">
    <text-reader></text-reader>
  </div>
</template>

<script>
import TextReader from './components/TextReader.vue'

export default {
  name: 'app',
  data: () => ({ text: "" }),
  components: {
    TextReader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
