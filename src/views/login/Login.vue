<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-weaper animated bounceInDown"
    >
      <div class="login-left">
        <div class="login-time">
          {{ time }}
        </div>
        <img
          class="img"
          src="https://gitee.com/codeprometheus/MyPicBed/raw/master/img/star.png"
        />
        <p class="tit">Vue-Starry-Blog</p>
      </div>

      <div class="login-border">
        <div class="login-main">
          <h3 class="tit">Login</h3>
          <el-form-item prop="username">
            <el-input
              size="small"
              v-model="loginForm.username"
              prefix-icon="el-icon-user-solid"
              auto-complete="off"
              placeholder="账号"
              @keyup.enter.native="login"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              size="small"
              v-model="loginForm.password"
              prefix-icon="iconfont el-icon-mymima"
              show-password
              placeholder="密码"
              @keyup.enter.native="login"
            ></el-input>
          </el-form-item>
          <el-form>
            <el-button class="login-submit" type="primary" @click="login">登录</el-button>
          </el-form>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { dateFormat } from "@/util/data";
import { generateMenu } from "@/assets/js/menu";

export default {
  created() {
    this.getTime();
  },
  data: function() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      loading: false,
      time: ""
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const that = this;
          // eslint-disable-next-line no-undef
          let captcha = new TencentCaptcha(
            this.config.TENCENT_CAPTCHA,
            function(res) {
              if (res.ret === 0) {
                // 发送登录请求
                let param = new URLSearchParams();
                param.append("username", that.loginForm.username);
                param.append("password", that.loginForm.password);
                that.axios.post("/api/login", param).then(({ data }) => {
                  if (data.flag) {
                    // 登录后保存用户信息
                    that.$store.commit("login", data.data);
                    // 加载用户菜单
                    generateMenu();
                    that.$message.success("登录成功");
                    that.$router.push({ path: "/" });
                  } else {
                    that.$message.error(data.message);
                  }
                });
              }
            }
          );
          // 显示验证码
          captcha.show();
        } else {
          return false;
        }
      });
    },
    getTime() {
      setInterval(() => {
        this.time = dateFormat(new Date());
      }, 1000);
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url("https://cdn.jsdelivr.net/gh/constown/HexoStaticFile/img/20210127120147.jpg");
  background-size: cover;
  animation: animate-cloud 20s linear infinite;
}

.login-weaper {
  margin: 0 auto;
  width: 1000px;
  box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
}

.el-input-group__append {
  border: none;
}


.login-left,
.login-border {
  position: relative;
  min-height: 500px;
  align-items: center;
  display: flex;
}

.login-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  justify-content: center;
  flex-direction: column;
  background-color: #409eff;
  color: #fff;
  float: left;
  width: 50%;
  position: relative;
}

.login-left .img {
  width: 140px;
}

.login-time {
  position: absolute;
  left: 25px;
  top: 25px;
  width: 100%;
  color: #fff;
  font-weight: 200;
  opacity: 0.9;
  font-size: 18px;
  overflow: hidden;
}

.login-left .tit {
  margin-top: 60px;
  text-align: center;
  color: #fff;
  font-weight: 300;
  letter-spacing: 2px;
  font-size: 25px;
}

.login-border {
  border-left: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: #fff;
  background-color: #fff;
  width: 50%;
  float: left;
  box-sizing: border-box;
}

.login-main {
  margin: 0 auto;
  width: 65%;
  box-sizing: border-box;
}

.login-main > h3 {
  margin-bottom: 20px;
}

.login-main > p {
  color: #76838f;
}

.tit {
  position: relative;
  color: #333;
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 22px;
  text-align: center;
  letter-spacing: 4px;
  font-family: "Fira Code";
}

.login-menu {
  margin-top: 40px;
  width: 100%;
  text-align: center;
}

a {
  color: #999;
  font-size: 12px;
  margin: 0px 8px;
}

.login-submit {
  width: 100%;
  height: 45px;
  border: 1px solid #409eff;
  background: none;
  font-size: 18px;
  letter-spacing: 2px;
  font-weight: 300;
  color: #409eff;
  cursor: pointer;
  margin-top: 30px;
  font-family: "neo";
  transition: 0.25s;
}

.el-input >>> .el-input__inner {
  outline: medium;
  padding-bottom: 10px;
  text-indent: 5px;
  background: transparent;
  border: none;
  border-radius: 0;
  color: #333;
  border-bottom: 1px solid rgb(235, 237, 242);
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;
}

img {
  cursor: pointer;
  vertical-align: middle;
}


.login-code-img {
  height: 38px;
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
