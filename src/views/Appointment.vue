<template>
  <div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="患者姓名">
        <el-input size="small" v-model="queryForm.userName" width="370px"></el-input>
      </el-form-item>
      <el-form-item label="预约状态">
        <el-select size="small" v-model="queryForm.status" width="370px" filterable clearable>
          <el-option key="预约成功" label="预约成功" value="预约成功" />
          <el-option key="已报到" label="已报到" value="已报到" />
          <el-option key="已诊疗" label="已诊疗" value="已诊疗" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border
      element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="userName" label="预约患者" align="center" />
      <el-table-column prop="departmentName" label="预约科室" align="center" />
      <el-table-column prop="scheduleName" label="排班时间" align="center" />
      <el-table-column prop="status" label="预约状态" align="center" />
      <el-table-column prop="result" label="诊疗结果" align="center" />
      <el-table-column prop="price" label="诊疗费用" align="center" />
      <el-table-column prop="paytype" label="支付方式" align="center" />
      <el-table-column prop="createTime" label="预约时间" align="center" />
      <el-table-column label="操作" width="200px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '已报到'" size="mini" type="primary" @click="toEdit(scope.row)"><i class="el-icon-edit" />诊疗</el-button>
          <el-button size="mini" type="warning" @click="toView(scope.row)"><i class="el-icon-check" />疾病史</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="queryForm" @callFather="updatePageparam"></Pagination>
    <!-- 编辑表单 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editDialogFlag" :title="editTitle"
      width="600px">
      <el-form ref="editForm" inline :model="editForm" :rules="rules" size="small" label-width="120px">
        <el-form-item label="诊疗结果" prop="result">
          <el-input type="textarea" rows="5" size="small" v-model="editForm.result" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="诊疗费用" prop="price">
          <el-input-number :precision="2" size="small" v-model="editForm.price" style="width: 400px"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="editDialogFlag = false">取消</el-button>
        <el-button :loading="editLoading" type="primary" @click="edit">确认</el-button>
      </div>
    </el-dialog>
    <!-- 编辑表单 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editDialogFlag2" :title="editTitle"
               width="600px">
      <el-table size="small" :data="diseaseList" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
        <el-table-column prop="name" label="疾病名称" align="center" />
        <el-table-column prop="reason" label="病因" align="center" />
        <el-table-column prop="getYear" label="确诊年份" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import crudAppointment from '@/api/appointment'
import crudUser from '@/api/user'
import Pagination from '@/components/Pagination'
import {Notification} from "element-ui";

export default {
  data() {
    return {
      loading: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        userId: null,
        departmentId: null,
        doctorId: null,
        scheduleId: null,
        status: null,
      },
      diseaseList: [],
      editForm: {
        userId: null,
        departmentId: null,
        doctorId: null,
        scheduleId: null,
        status: null,
      },
      userList: [],
      departmentList: [],
      doctorList: [],
      scheduleList: [],
      editDialogFlag: false,
      editDialogFlag2: false,
      editTitle: null,
      editLoading: false,
      listData: [],
      rules: {
        price: [
          { required: true, message: '诊疗费用不能为空', trigger: 'change' }
        ],
        result: [
          { required: true, message: '诊疗结果不能为空', trigger: 'change' }
        ],
      },
      user:{}
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    crudUser.currentUser().then(res => {
      this.user = res || {}
      this.queryData()
    });
  },

  methods: {
    queryData() {
      this.loading = true
      this.queryForm.doctorId = this.user.id
      crudAppointment.query(this.queryForm).then(res => {
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
      this.editTitle = '新增预约记录'
      this.editForm = {}
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toEdit(row) {
      this.editTitle = '编辑预约记录'
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editForm.price = undefined
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toView(row) {
      this.editTitle = '疾病史'
      crudUserDisease.query({userId: row.userId, pageSize:10000}).then(res => {
        this.diseaseList = res.entityList
        this.editDialogFlag2 = true
      })
    },
    edit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editLoading = true
          this.editForm.status = '已诊疗'
          crudAppointment.edit(this.editForm).then(res => {
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
      this.$confirm('确定删除【' + row.name + '】预约记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudAppointment.del(row.id).then(res => {
          Notification.success('删除成功')
          this.editDialogFlag = false
          this.queryData()
        }).catch(e => { })
      }).catch(e => { })
    },
  }
}
</script>
