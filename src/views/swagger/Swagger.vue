<template>
  <el-card class='main-card'>
    <iframe
      src='http://localhost:8989/swagger-ui/index.html'
      class='iframe'
    />
  </el-card>
</template>

<style scoped>
.iframe {
  height: calc(100vh - 170px);
  width: 100%;
  border: none;
}
</style>
