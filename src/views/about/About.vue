<template>
  <el-card class='main-card'>
    <div class='title'>
      {{ this.$route.name }}
    </div>
    <mavon-editor
      ref='md'
      @imgadd='uploadImg'
      v-model='aboutContent'
      style='height:calc(100vh - 215px);margin-top: 2.25rem'
    />
    <el-button
      type='danger'
      size='medium'
      class='edit-btn'
      @click='updateAbout'
    >
      修改
    </el-button>
  </el-card>
</template>

<script>
import * as imageConversion from 'image-conversion'

export default {
  created() {
    this.getAbout()
  },
  data: function() {
    return {
      aboutContent: ''
    }
  },
  methods: {
    getAbout() {
      this.axios.get('/api/about').then(({ data }) => {
        this.aboutContent = data.data
      })
    },
    updateAbout() {
      this.axios
        .put('/api/admin/about', {
          aboutContent: this.aboutContent
        })
        .then(({ data }) => {
          if (data.flag) {
            this.$notify.success({
              title: '成功',
              message: data.message
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: data.message
            })
          }
        })
    },
    uploadImg(pos, file) {
      let data = new FormData()
      if (file.size / 1024 < this.config.UPLOAD_SIZE) {
        data.append('file', file)
        this.axios.post('/api/admin/articles/images', data).then(({ data }) => {
          this.$refs.md.$img2Url(pos, data.data)
        })
      } else {
        // 压缩图片
        imageConversion
          .compressAccurately(file, this.config.UPLOAD_SIZE)
          .then(res => {
            data.append(
              'file',
              new window.File([res], file.name, { type: file.type })
            )
            this.axios
              .post('/api/admin/articles/images', data)
              .then(({ data }) => {
                this.$refs.md.$img2Url(pos, data.data)
              })
          })
      }
    }
  }
}
</script>

<style scoped>
.edit-btn {
  float: right;
  margin: 1rem 0;
}
</style>
