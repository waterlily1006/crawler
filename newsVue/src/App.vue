<template>
  <div id="app" class="app">
    <div class="layer">
      <NewsList msg="Welcome to Your Vue.js App" />
    </div>
  </div>
</template>

<script>
import NewsList from "./components/NewsList";

export default {
  name: "App",
  components: {
    NewsList
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

ul,
li {
  list-style: none;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-image: url("~@/assets/news_bg.jpg");
  background-attachment: fixed;
  background-size: cover;
  width: 100%;
  opacity: 1;
  padding: 0;
  min-height: 100vh;
}

.layer {
  width: 100%;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
</style>
