<template>
  <intro v-if="begin" @ended-video="begin = !begin" />
  <question-list v-else />
</template>

<script>
import Intro from "./components/Intro";
import QuestionList from "./components/QuestionList";

export default {
  components: {
    Intro,
    QuestionList,
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
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>