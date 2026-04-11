<template>
  <div class="geometric-bg"></div>
</template>

<style scoped>
.geometric-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fdf5f0;
  background-image: 
    repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(139, 69, 19, 0.08) 35px, rgba(139, 69, 19, 0.08) 36px),
    repeating-linear-gradient(60deg, transparent, transparent 35px, rgba(139, 69, 19, 0.08) 35px, rgba(139, 69, 19, 0.08) 36px),
    repeating-linear-gradient(120deg, transparent, transparent 35px, rgba(139, 69, 19, 0.08) 35px, rgba(139, 69, 19, 0.08) 36px);
  z-index: 0;
  pointer-events: none;
}
</style>
