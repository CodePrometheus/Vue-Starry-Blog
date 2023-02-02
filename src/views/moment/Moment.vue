<template>
  <el-card class='main-card'>
    <div class='title'>
      {{ this.$route.name }}
    </div>
    <div class='moment-container'>
      <div style='margin-left:auto'>
        <el-tooltip :content="'红色为仅对自己可见'">
          <el-switch
            v-model='moment.status'
            active-color='#13ce66'
            inactive-color='#ff4949'
            active-value='0'
            inactive-value='1'
          />
        </el-tooltip>
        <el-button
          type='danger'
          size='medium'
          icon='el-icon-danger'
          style='margin-left:1rem'
          @click='saveOrUpdateMoment'
        >
          发布动态
        </el-button>
        <el-button
          type='danger'
          size='medium'
          icon='el-icon-danger'
          class='save-btn'
          @click='saveMomentDraft'
          v-if='moment.id != null || moment.status == 3'
        >
          保存草稿
        </el-button>
      </div>
    </div>
    <!-- 动态内容 -->
    <mavon-editor
      ref='md'
      v-model='moment.momentContent'
      @imgAdd='uploadImg'
      style='height:calc(100vh - 260px);margin-top: 1rem'
    />
  </el-card>
</template>

<script>
export default {
  created() {
    const path = this.$route.path
    const arr = path.split('/')
    const momentId = arr[2]
    if (momentId) {
      this.axios.get('/api/admin/moments/' + momentId).then(({ data }) => {
        console.log(data)
        this.moment = data.data
      })
    } else {
      const moment = sessionStorage.getItem('moment')
      if (moment) {
        this.moment = JSON.parse(moment)
      }
    }
  },
  destroyed() {
    this.autoSaveMoment()
  },
  data() {
    return {
      moment: {
        id: null,
        momentContent: '',
        isTop: 0,
        status: 1,
        isDelete: 0,
        autoSave: true
      }
    }
  },
  methods: {
    saveMomentDraft() {
      if (this.moment.momentContent === '') {
        this.$message.error('动态内容不能为空')
        return false
      }
      this.moment.status = 3
      this.axios.post('/api/admin/moments', this.moment).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: '成功',
            message: '保存草稿成功'
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '保存草稿失败'
          })
        }
      })
      this.autoSave = false
    },
    autoSaveMoment() {
      if (
        this.autoSave &&
        this.moment.momentContent.trim() != '' &&
        this.moment.id != null
      ) {
        this.axios.post('/api/admin/moments', this.moment).then(({ data }) => {
          if (data.flag) {
            this.$notify.success({
              title: '成功',
              message: '自动保存成功'
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: '自动保存失败'
            })
          }
        })
      }
      if (this.autoSave && this.moment.id == null) {
        sessionStorage.setItem('moment', JSON.stringify(this.moment))
      }
    },
    uploadImg(pos, file) {
      let formData = new FormData()
      formData.append('file', file)
      this.axios
        .post('/api/admin/moments/images', formData)
        .then(({ data }) => {
          this.$refs.md.$img2Url(pos, data.data)
        })
    },
    saveOrUpdateMoment() {
      if (this.moment.momentContent === '') {
        this.$message.error('动态内容不能为空')
        return false
      }
      this.isDelete = 0
      this.axios.post('/api/admin/moments', this.moment).then(({ data }) => {
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
      this.autoSave = false
    }
  }
}
</script>

<style scoped>
.moment-container {
  display: flex;
  align-items: center;
}

.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
</style>
