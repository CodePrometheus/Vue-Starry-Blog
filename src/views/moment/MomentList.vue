<template>
  <el-card class="main-card">
    <div class="title">
      {{ this.$route.name }}
    </div>
    <div class="moment-status-menu">
      <span>状态</span>
      <span @click="changeStatus('all')" :class="isActive('all')">全部</span>
      <span @click="changeStatus('public')" :class="isActive('public')">
        公开
      </span>
      <span @click="changeStatus('secret')" :class="isActive('secret')">
        私密
      </span>
      <span @click="changeStatus('draft')" :class="isActive('draft')">
        草稿箱
      </span>
      <span @click="changeStatus('delete')" :class="isActive('delete')">
        回收站
      </span>
    </div>
    <div class="operation-container">
      <el-button
        v-if="isDelete === 0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="momentIdList.length === 0"
        @click="updateIsDelete = true"
      >
        批量删除
      </el-button>
      <el-button
        v-else
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="momentIdList.length === 0"
        @click="remove = true"
      >
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          clearable
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入动态关键字"
          style="width: 200px;"
          @keyup.enter.native="searchMoments"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="searchMoments"
        >
          搜索
        </el-button>
      </div>
    </div>
    <el-table
      border
      :data="momentList"
      @selection-change="selectionChange"
      v-loading="loading"
      element-loading-text="Loading..."
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="momentContent" label="动态内容" align="center">
        <template slot-scope="scope">
          <span v-html="scope.row.momentContent" class="moment-content" />
        </template>
      </el-table-column>
      <el-table-column prop="like" label="点赞量" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.like">
            {{ scope.row.like }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="isTop" label="是否置顶" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isTop"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :disabled="scope.row.isDelete == 1"
            :active-value="1"
            :inactive-value="0"
            @change="changeTop(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.updateTime | date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isDelete == 0"
            type="primary"
            size="mini"
            slot="reference"
            @click="editMoment(scope.row.id)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确定放入回收站吗?"
            style="margin-left: 10px"
            @confirm="updateMomentsDelete(scope.row.id)"
            v-if="scope.row.isDelete == 0"
          >
            <el-button size="mini" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
          <el-popconfirm
            title="确定恢复吗?"
            style="margin-left: 10px"
            @confirm="updateMomentsDelete(scope.row.id)"
            v-if="scope.row.isDelete == 1"
          >
            <el-button size="mini" type="success" slot="reference">
              恢复
            </el-button>
          </el-popconfirm>
          <el-popconfirm
            title="确定彻底删除吗?"
            style="margin-left: 10px"
            @confirm="deleteMoments(scope.row.id)"
            v-if="scope.row.isDelete === 1"
          >
            <el-button size="mini" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 批量逻辑删除对话框 -->
    <el-dialog :visible.sync="updateIsDelete" width="30%">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否将选中项放入回收站？</div>
      <div slot="footer">
        <el-button @click="updateIsDelete = false">取 消</el-button>
        <el-button type="primary" @click="updateMomentsDelete(null)">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 批量彻底删除对话框 -->
    <el-dialog :visible.sync="remove" width="30%">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否彻底删除选中项？</div>
      <div slot="footer">
        <el-button @click="remove = false">取 消</el-button>
        <el-button type="primary" @click="deleteMoments(null)">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      remove: false,
      updateIsDelete: false,
      momentList: [],
      momentIdList: [],
      keywords: null,
      isDelete: 0,
      status: null,
      current: 1,
      size: 10,
      count: 0,
      activeStatus: "all"
    };
  },
  methods: {
    sizeChange(size) {
      this.size = size;
      this.listMoments();
    },
    currentChange(current) {
      this.current = current;
      this.listMoments();
    },
    editMoment(id) {
      this.$router.push({ path: "/moments/" + id });
    },
    deleteMoments(id) {
      let param = {};
      if (id == null) {
        param = { data: this.momentIdList };
      } else {
        param = { data: [id] };
      }
      this.axios.delete("/api/admin/moments", param).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: "成功",
            message: data.message
          });
          this.listMoments();
        } else {
          this.$notify.success({
            title: "失败",
            message: data.message
          });
        }
        this.remove = false;
      });
    },
    updateMomentsDelete(id) {
      let param = {};
      if (id != null) {
        param.idList = [id];
      } else {
        param.idList = this.momentIdList;
      }
      param.isDelete = this.isDelete === 0 ? 1 : 0;
      this.axios.put("/api/admin/moments", param).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: "成功",
            message: data.message
          });
          this.listMoments();
        } else {
          this.$notify.error({
            title: "失败",
            message: data.message
          });
        }
        this.updateIsDelete = false;
      });
    },
    selectionChange(momentIdList) {
      this.momentIdList = [];
      momentIdList.forEach(v => {
        this.momentIdList.push(v.id);
      });
    },
    changeStatus(status) {
      switch (status) {
        case "all":
          this.isDelete = 0;
          this.status = null;
          break;
        case "public":
          this.isDelete = 0;
          this.status = 1;
          break;
        case "secret":
          this.isDelete = 0;
          this.status = 2;
          break;
        case "draft":
          this.isDelete = 0;
          this.status = 3;
          break;
        case "delete":
          this.isDelete = 1;
          this.status = null;
          break;
      }
      this.activeStatus = status;
      this.searchMoments();
    },
    searchMoments() {
      this.current = 1;
      this.listMoments();
    },
    listMoments() {
      this.axios
        .get("/api/admin/moments", {
          params: {
            current: this.current,
            size: this.size,
            keywords: this.keywords,
            isDelete: this.isDelete,
            status: this.status
          }
        })
        .then(({ data }) => {
          this.momentList = data.data.recordList;
          this.count = data.data.count;
          this.loading = false;
        });
    },
    changeTop(moment) {
      this.axios
        .put("/api/admin/moments/top", {
          id: moment.id,
          isTop: moment.isTop
        })
        .then(({ data }) => {
          if (data.flag) {
            this.$notify.success({
              title: "成功",
              message: "设置成功"
            });
          } else {
            this.$notify.error({
              title: "失败",
              message: data.message
            });
          }
          this.remove = false;
        });
    }
  },
  computed: {
    isActive() {
      return function(status) {
        return this.activeStatus == status ? "active-status" : "status";
      };
    }
  }
};
</script>

<style scoped>
.operation-container {
  margin-top: 1.5rem;
}

.moment-status-menu {
  font-size: 14px;
  margin-top: 40px;
  color: #999;
}
.moment-status-menu span {
  margin-right: 24px;
}

.status {
  cursor: pointer;
}

.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.comment-content {
  display: inline-block;
}
</style>
