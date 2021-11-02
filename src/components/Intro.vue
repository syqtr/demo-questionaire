<template>
  <div class="container">
    <video
      ref="videoIntro"
      class="video"
      muted
      autoplay
      controls
      @ended="$emit('ended-video')"
    >
      <source src="/medias/videos/intro_1.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {};
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  display: flex;
  background: radial-gradient(
    circle,
    rgba(247, 150, 192, 1) 0%,
    rgba(118, 174, 241, 1) 100%
  );
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.video {
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  object-fit: fill;
}
</style>