<template>
  <el-card class='main-card'>
    <el-tabs v-model='activeName' @tab-click='handleClick'>
      <!-- 修改信息 -->
      <el-tab-pane label='网站信息' name='info'>
        <el-form
          label-width='100px'
          :model='websiteConfigForm'
          label-position='left'
        >
          <el-form-item label='网站头像'>
            <el-upload
              class='avatar-uploader'
              action='/api/admin/page/images'
              :show-file-list='false'
              :on-success='handleWebsiteAvatarSuccess'
            >
              <img
                v-if='websiteConfigForm.websiteAvatar'
                :src='websiteConfigForm.websiteAvatar'
                class='avatar'
              />
              <i v-else class='el-icon-plus avatar-uploader-icon' />
            </el-upload>
          </el-form-item>
          <el-form-item label='网站名称'>
            <el-input
              v-model='websiteConfigForm.websiteName'
              size='small'
              style='width:400px'
            />
          </el-form-item>
          <el-form-item label='网站作者'>
            <el-input
              v-model='websiteConfigForm.websiteAuthor'
              size='small'
              style='width:400px'
            />
          </el-form-item>
          <el-form-item label='网站简介'>
            <el-input
              v-model='websiteConfigForm.websiteIntro'
              size='small'
              style='width:400px'
            />
          </el-form-item>
          <el-form-item label='网站创建日期'>
            <el-date-picker
              value-format='yyyy-MM-dd'
              v-model='websiteConfigForm.websiteCreateTime'
              type='date'
              placeholder='选择日期'
              style='width:400px'
            />
          </el-form-item>
          <el-form-item label='网站公告'>
            <el-input
              v-model='websiteConfigForm.websiteNotice'
              placeholder='请输入公告内容'
              style='width:400px'
              type='textarea'
              :rows='5'
            />
          </el-form-item>
          <el-form-item label='备案号'>
            <el-input
              v-model='websiteConfigForm.websiteRecordNo'
              size='small'
              style='width:400px'
            />
          </el-form-item>
          <el-form-item label='第三方登录'>
            <el-checkbox-group v-model='websiteConfigForm.socialLoginList'>
              <el-checkbox label='qq'>QQ</el-checkbox>
              <el-checkbox label='weibo'>微博</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-button
            type='primary'
            size='medium'
            style='margin-left:6.3rem'
            @click='updateWebsiteConfig'
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
      <!-- 社交信息 -->
      <el-tab-pane label='社交信息' name='notice'>
        <el-form label-width='70px' :model='websiteConfigForm'>
          <!-- 多选框 -->
          <el-checkbox-group v-model='websiteConfigForm.socialUrlList'>
            <el-form-item label='QQ'>
              <el-input
                v-model='websiteConfigForm.qq'
                size='small'
                style='width:400px;margin-right:1rem'
              />
              <el-checkbox label='QQ'>是否展示</el-checkbox>
            </el-form-item>
            <el-form-item label='Github'>
              <el-input
                v-model='websiteConfigForm.github'
                size='small'
                style='width:400px;margin-right:1rem'
              />
              <el-checkbox label='Github'>是否展示</el-checkbox>
            </el-form-item>
            <el-form-item label='BiliBili'>
              <el-input
                v-model='websiteConfigForm.bilibili'
                size='small'
                style='width:400px;margin-right:1rem'
              />
              <el-checkbox label='bilibili'>是否展示</el-checkbox>
            </el-form-item>
            <el-button
              type='primary'
              size='medium'
              style='margin-left:4.375rem'
              @click='updateWebsiteConfig'
            >
              修改
            </el-button>
          </el-checkbox-group>
        </el-form>
      </el-tab-pane>
      <!-- 网站设置 -->
      <el-tab-pane label='网站设置' name='password'>
        <el-form
          label-width='120px'
          :model='websiteConfigForm'
          label-position='left'
        >
          <el-row style='width: 600px;'>
            <el-col :md='12'>
              <el-form-item label='用户头像'>
                <el-upload
                  class='avatar-uploader'
                  action='/api/admin/page/images'
                  :show-file-list='false'
                  :on-success='handleUserAvatarSuccess'
                >
                  <img
                    v-if='websiteConfigForm.userAvatar'
                    :src='websiteConfigForm.userAvatar'
                    class='avatar'
                  />
                  <i v-else class='el-icon-plus avatar-uploader-icon' />
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :md='12'>
              <el-form-item label='游客头像'>
                <el-upload
                  class='avatar-uploader'
                  action='/api/admin/page/images'
                  :show-file-list='false'
                  :on-success='handleTouristAvatarSuccess'
                >
                  <img
                    v-if='websiteConfigForm.touristAvatar'
                    :src='websiteConfigForm.touristAvatar'
                    class='avatar'
                  />
                  <i v-else class='el-icon-plus avatar-uploader-icon' />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label='邮箱通知'>
            <el-radio-group v-model='websiteConfigForm.isEmailNotice'>
              <el-radio :label='0'>关闭</el-radio>
              <el-radio :label='1'>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label='评论审核'>
            <el-radio-group v-model='websiteConfigForm.isCommentReview'>
              <el-radio :label='0'>关闭</el-radio>
              <el-radio :label='1'>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label='留言审核'>
            <el-radio-group v-model='websiteConfigForm.isMessageReview'>
              <el-radio :label='0'>关闭</el-radio>
              <el-radio :label='1'>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label='打赏状态'>
            <el-radio-group v-model='websiteConfigForm.isReward'>
              <el-radio :label='0'>关闭</el-radio>
              <el-radio :label='1'>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row style='width:600px' v-show='websiteConfigForm.isReward == 1'>
            <!-- 微信收款码 -->
            <el-col :md='12'>
              <el-form-item label='微信收款码'>
                <el-upload
                  class='avatar-uploader'
                  action='/api/admin/page/images'
                  :show-file-list='false'
                  :on-success='handleWeiXinSuccess'
                >
                  <img
                    v-if='websiteConfigForm.weiXinQRCode'
                    :src='websiteConfigForm.weiXinQRCode'
                    class='avatar'
                  />
                  <i v-else class='el-icon-plus avatar-uploader-icon' />
                </el-upload>
              </el-form-item>
            </el-col>
            <!-- 支付宝收款码 -->
            <el-col :md='12'>
              <el-form-item label='支付宝收款码'>
                <el-upload
                  class='avatar-uploader'
                  action='/api/admin/page/images'
                  :show-file-list='false'
                  :on-success='handleAlipaySuccess'
                >
                  <img
                    v-if='websiteConfigForm.alipayQRCode'
                    :src='websiteConfigForm.alipayQRCode'
                    class='avatar'
                  />
                  <i v-else class='el-icon-plus avatar-uploader-icon' />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 聊天室状态 -->
          <el-form-item label='聊天室状态'>
            <el-radio-group v-model='websiteConfigForm.isChatRoom'>
              <el-radio :label='0'>关闭</el-radio>
              <el-radio :label='1'>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label='Websocket地址'
            v-show='websiteConfigForm.isChatRoom == 1'
          >
            <el-input
              v-model='websiteConfigForm.websocketUrl'
              size='small'
              style='width:400px'
            />
          </el-form-item>
          <el-form-item label='看板娘状态'>
            <el-radio-group v-model='websiteConfigForm.isLive2D'>
              <el-radio :label='0'>关闭</el-radio>
              <el-radio :label='1'>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button
            type='primary'
            size='medium'
            style='margin-left:6.3rem'
            @click='updateWebsiteConfig'
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  created() {
    this.getWebsiteConfig()
  },
  data: function() {
    return {
      websiteConfigForm: {
        websiteAvatar: '',
        websiteName: '',
        websiteAuthor: '',
        websiteIntro: '',
        websiteNotice: '',
        websiteCreateTime: null,
        websiteRecordNo: '',
        socialLoginList: [],
        socialUrlList: [],
        qq: '',
        github: '',
        bilibili: '',
        userAvatar: '',
        touristAvatar: '',
        weiXinQRCode: '',
        alipayQRCode: '',
        isChatRoom: 1,
        websocketUrl: '',
        isEmailNotice: 1,
        isCommentReview: 0,
        isMessageReview: 0,
        isLive2D: 1,
        isReward: 1
      },
      activeName: 'info'
    }
  },
  methods: {
    getWebsiteConfig() {
      this.axios.get('/api/admin/website/config').then(({ data }) => {
        this.websiteConfigForm = data.data
      })
    },
    updateWebsiteConfig() {
      this.axios
        .put('/api/admin/website/config', this.websiteConfigForm)
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
    handleClick() {
    },
    handleWebsiteAvatarSuccess(response) {
      this.websiteConfigForm.websiteAvatar = response.data
    },
    handleTouristAvatarSuccess(response) {
      this.websiteConfigForm.touristAvatar = response.data
    },
    handleUserAvatarSuccess(response) {
      this.websiteConfigForm.userAvatar = response.data
    },
    handleWeiXinSuccess(response) {
      this.websiteConfigForm.weiXinQRCode = response.data
    },
    handleAlipaySuccess(response) {
      this.websiteConfigForm.alipayQRCode = response.data
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
