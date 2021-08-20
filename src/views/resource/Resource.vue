<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <div class="operation-container">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openModel(null)"
      >
        新增模块
      </el-button>
    </div>
    <!-- 权限列表 -->
    <el-table
      v-loading="loading"
      element-loading-text="Loading..."
      :data="resourceList"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="selectionChange"
    >
      <el-table-column prop="resourceName" label="资源名" width="220" />
      <el-table-column prop="url" label="资源路径" width="300" />
      <el-table-column prop="requestMethod" label="请求方式">
        <template slot-scope="scope" v-if="scope.row.requestMethod">
          <el-tag :type="tagType(scope.row.requestMethod)">
            {{ scope.row.requestMethod }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isAnonymous" label="匿名访问" align="center">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.url"
            v-model="scope.row.isAnonymous"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
            @change="changeResource(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="openAddResourceModel(scope.row)"
            v-if="scope.row.children"
          >
            <i class="el-icon-plus" /> 新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="openEditResourceModel(scope.row)"
          >
            <i class="el-icon-edit" /> 修改
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:10px"
            @confirm="deleteResource(scope.row.id)"
          >
            <el-button size="mini" type="text" slot="reference">
              <i class="el-icon-delete" /> 删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "Resource"
};
</script>

<style scoped></style>
