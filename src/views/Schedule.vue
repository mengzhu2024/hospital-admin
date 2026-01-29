<template>
  <div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="医生">
        <el-select size="small" v-model="queryForm.doctorId" filterable clearable>
          <el-option v-for="item in doctorList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="排班日期">
        <el-date-picker size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="queryForm.workDate" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
        <el-button size="small" type="success" icon="el-icon-plus" @click="toAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border
      element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="doctorName" label="医生" align="center" />
      <el-table-column prop="workDate" label="排班日期" align="center" />
      <el-table-column prop="workTime" label="排班时间" align="center" />
      <el-table-column prop="avaliableNum" label="可预约量" align="center" />
      <el-table-column prop="usedNum" label="已预约量" align="center" />
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toEdit(scope.row)"><i class="el-icon-edit" />编辑</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row)"><i class="el-icon-delete" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="queryForm" @callFather="updatePageparam"></Pagination>
    <!-- 编辑表单 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editDialogFlag" :title="editTitle"
      width="600px">
      <el-form ref="editForm" inline :model="editForm" :rules="rules" size="small" label-width="120px">
        <el-form-item label="医生" prop="doctorId">
          <el-select v-model="editForm.doctorId" filterable clearable style="width: 400px">
            <el-option v-for="item in doctorList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排班日期" prop="workDate">
          <el-date-picker size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="editForm.workDate"
            style="width: 400px"></el-date-picker>
        </el-form-item>
        <el-form-item label="排班时间" prop="workTime">
          <el-select v-model="editForm.workTime" filterable clearable style="width: 400px">
            <el-option key="上午" label="上午" value="上午" />
            <el-option key="下午" label="下午" value="下午" />
          </el-select>
        </el-form-item>
        <el-form-item label="可预约量" prop="avaliableNum">
          <el-input-number size="small" v-model="editForm.avaliableNum" style="width: 400px"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="editDialogFlag = false">取消</el-button>
        <el-button :loading="editLoading" type="primary" @click="edit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudSchedule from '@/api/schedule'
import crudDoctor from '@/api/doctor'
import Pagination from '@/components/Pagination'
import { downloadFile } from "@/utils/download";
import { Notification } from "element-ui";
export default {
  data() {
    return {
      loading: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        doctorId: null,
        workDate: null,
        workTime: null,
        avaliableNum: null,
      },
      editForm: {
        doctorId: null,
        workDate: null,
        workTime: null,
        avaliableNum: null,
      },
      doctorList: [],
      editDialogFlag: false,
      editTitle: null,
      editLoading: false,
      listData: [],
      rules: {
        doctorId: [
          { required: true, message: '医生不能为空', trigger: 'change' }
        ],
        workDate: [
          { required: true, message: '排班日期不能为空', trigger: 'change' }
        ],
        workTime: [
          { required: true, message: '排班时间不能为空', trigger: 'change' }
        ],
        avaliableNum: [
          { required: true, message: '可预约量不能为空', trigger: 'change' }
        ],
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    this.queryData()
    crudDoctor.query({ pageSize: 10000 }).then(res => {
      this.doctorList = res.entityList
    })
  },

  methods: {
    queryData() {
      this.loading = true
      crudSchedule.query(this.queryForm).then(res => {
        this.listData = res.entityList
        this.loading = false
        this.queryForm.pageNum = res.pageNum
        this.queryForm.total = res.rowCount
      })
    },
    updatePageparam(pageparm) {
      this.queryForm.pageNum = pageparm.pageNum
      this.queryForm.pageSize = pageparm.pageSize
      this.queryData()
    },
    toAdd() {
      this.editTitle = '新增排班记录'
      this.editForm = {}
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toEdit(row) {
      this.editTitle = '编辑排班记录'
      this.editForm = row
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    edit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editLoading = true
          crudSchedule.edit(this.editForm).then(res => {
            Notification.success('编辑成功')
            this.editLoading = false
            this.editDialogFlag = false
            this.queryData()
          }).catch(e => {
            this.editLoading = false
          })
        }
      })
    },
    toDelete(row) {
      this.$confirm('确定删除【' + row.name + '】排班记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudSchedule.del(row.id).then(res => {
          Notification.success('删除成功')
          this.editDialogFlag = false
          this.queryData()
        }).catch(e => { })
      }).catch(e => { })
    },
  }
}
</script>
