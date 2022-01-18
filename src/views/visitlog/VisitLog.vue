<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <div class="operation-container">
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="this.logIdList.length == 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <!-- 搜索  -->
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入请求方法、描述或行为"
          style="width: 200px;"
          @keyup.enter.native="searchLogs"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="searchLogs"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 访问日志 -->
    <el-table
      @selection-change="selectionChange"
      v-loading="loading"
      element-loading-text="Loading..."
      :data="logList"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        prop="nickname"
        label="访客昵称"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.nickname">
            {{ scope.row.nickname }}
          </span>
          <span v-else>神秘人</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="visitDesc"
        label="访问描述"
        align="center"
        width="130"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.visitDesc">
            {{ scope.row.visitDesc }}
          </span>
          <span v-else>神秘内容</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="访问行为"
        align="center"
        width="180"
      />
      <el-table-column
        prop="ipAddr"
        label="访问ip"
        align="center"
        width="150"
      />
      <el-table-column
        prop="ipSource"
        label="访问地址"
        align="center"
        width="180"
      />
      <el-table-column
        prop="browser"
        label="浏览器"
        align="center"
        width="200"
      />
      <el-table-column
        prop="os"
        label="操作系统"
        align="center"
        width="150"
      />
      <el-table-column
        prop="createTime"
        label="访问时间"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | dateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            slot="reference"
            @click="check(scope.row)"
          >
            <i class="el-icon-view" /> 查看
          </el-button>
          <el-popconfirm
            title="确定删除吗?"
            style="margin-left: 10px"
            @confirm="deleteLog(scope.row.id)"
          >
            <el-button size="mini" type="text" slot="reference">
              <i class="el-icon-delete" /> 删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
    <!-- 查看模态框 -->
    <el-dialog :visible.sync="isCheck" width="40%">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-more" /> 详细信息
      </div>
      <el-form ref="form" :model="visitLog" label-width="100px" size="mini">
        <el-form-item label="访问路径：">
          {{ visitLog.visitUrl }}
        </el-form-item>
        <el-form-item label="内容：">
          {{ visitLog.visitDesc }}
        </el-form-item>
        <el-form-item label="请求方式：">
          {{ visitLog.requestMethod }}
        </el-form-item>
        <el-form-item label="请求参数：">
          {{ visitLog.requestParam }}
        </el-form-item>
        <el-form-item label="返回数据：">
          {{ visitLog.responseData }}
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量删除对话框 -->
    <el-dialog :visible.sync="isDelete" width="30%">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-warning" style="color:#ff9900" /> 提示
      </div>
      <div style="font-size:1rem">是否删除选中项?</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteLog(null)">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  created() {
    this.listLogs();
  },
  data() {
    return {
      loading: true,
      logList: [],
      logIdList: [],
      keywords: null,
      size: 10,
      current: 1,
      count: 0,
      isCheck: false,
      isDelete: false,
      visitLog: {}
    };
  },
  methods: {
    selectionChange(logList) {
      this.logIdList = [];
      logList.forEach(v => {
        this.logIdList.push(v.id);
      });
    },
    sizeChange(size) {
      this.size = size;
      this.listLogs();
    },
    currentChange(current) {
      this.current = current;
      this.listLogs();
    },
    searchLogs() {
      this.current = 1;
      this.listLogs();
    },
    listLogs() {
      this.axios
        .get("/api/admin/visit", {
          params: {
            current: this.current,
            size: this.size,
            keywords: this.keywords
          }
        })
        .then(({ data }) => {
          this.logList = data.data.recordList;
          this.count = data.data.count;
          this.loading = false;
        });
    },
    deleteLog(id) {
      let param = {};
      if (id != null) {
        param = { data: [id] };
      } else {
        param = { data: this.logIdList };
      }
      this.axios.delete("/api/admin/visit", param).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: "成功",
            message: data.message
          });
          this.listLogs();
        } else {
          this.$notify.error({
            title: "失败",
            message: data.message
          });
        }
        this.isDelete = false;
      });
    },
    check(visitLog) {
      this.visitLog = JSON.parse(JSON.stringify(visitLog));
      this.isCheck = true;
    }
  }
};
</script>
