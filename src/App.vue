<template>
  <div id="app">
    <topnav />
    <text-reader />
  </div>
</template>

<script>
import topnav from './components/topnav.vue'
import TextReader from './components/TextReader.vue'

export default {
  name: 'app',
  data: () => ({ text: "" }),
  components: {
    topnav,
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
  max-width: 1160px;
  margin:0 auto;
}
</style>
