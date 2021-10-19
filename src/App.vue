<template>
  <intro v-if="begin" @ended-video="begin = !begin" />
  <question v-else />
</template>

<script>
import Intro from "./components/Intro";
import Question from "./components/Question";

export default {
  components: {
    Intro,
    Question,
  },
  data() {
    return {
      begin: true,
    };
  },
};
</script>

<style>
html,
body {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>