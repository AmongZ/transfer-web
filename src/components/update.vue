<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="4">
        <el-button class="button-el" style="margin-left: 30px" type="primary" @click="dialogFormVisible = true">修改</el-button>
        <el-dialog :visible.sync="dialogFormVisible">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="平台ID" prop="id">
              <el-input v-model="ruleForm.id" placeholder="请输入平台ID"></el-input>
            </el-form-item>
            <el-form-item label="平台名称" prop="platformName">
              <el-input v-model="ruleForm.platformName" placeholder="请输入平台名称"></el-input>
            </el-form-item>
            <el-form-item label="平台分类" style="width: 300px" prop="classifyId">
              <el-select v-model="ruleForm.classifyId" placeholder="请选择平台分类" class="input-def-el">
                <el-option v-for="item in classifyList" :key="item.classifyId" :label="item.classifyName" :value="item.classifyId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门" prop="deptName" style="width: 300px">
              <el-autocomplete
                class="input-def-el"
                v-model="ruleForm.deptName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入部门/组织名称"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="测试环境地址" prop="testEnv">
              <el-input v-model="ruleForm.testEnv"></el-input>
            </el-form-item>
            <el-form-item label="模拟环境地址" prop="preEnv">
              <el-input v-model="ruleForm.preEnv"></el-input>
            </el-form-item>
            <el-form-item label="生产环境地址" prop="prodEnv">
              <el-input v-model="ruleForm.prodEnv"></el-input>
            </el-form-item>
            <el-form-item label="LOGO地址" prop="favicon">
              <el-input v-model="ruleForm.favicon" placeholder="平台的LOGO地址"></el-input>
            </el-form-item>
            <el-form-item label="平台序号" prop="sort">
              <el-input v-model="ruleForm.sort" placeholder="请输入平台序号"></el-input>
            </el-form-item>
            <el-form-item label="平台描述" prop="platformDesc">
              <el-input type="textarea" v-model="ruleForm.platformDesc" placeholder="请选择平台描述"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
      <el-col :span="4">
        <el-input v-model="id" placeholder="请输入平台ID" style="margin-left: 100px; width: 100%"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="button-el" type="primary" @click="platformDelete()">删除</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  console.log(process.env);
  var host = process.env.VUE_APP_HOST;
  export default {
    data() {
      return {
        id: '',
        platformData: [], // 总数据
        deptId: '',
        deptName: '',
        platformName: '',
        classifyId: '',
        classifyName: '',
        deptList: [],
        classifyList: [],
        restaurants: [],
        timeout: null,
        dialogTableVisible: false,
        dialogFormVisible: false,
        ruleForm: {
          id: '',
          deptName: '',
          deptId: '',
          platformDesc: '',
          platformName: '',
          classifyId: '',
          classifyName: '',
          preEnv: '',
          testEnv: '',
          prodEnv: '',
          sort: '',
        },
        rules: {},
      };
    },
    methods: {
      querySearchAsync(queryString, cb) {
        var restaurants = this.deptList;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(results);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 300 * Math.random());
      },

      createStateFilter(queryString) {
        return state => {
          return state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
        };
      },
      handleSelect(item) {
        console.log('state======> ' + this.state);
        this.ruleForm.deptId = item.deptId;
        console.log('======> ' + item);
      },

      //获取部门信息
      async getDept() {
        this.$axios
          .get(host + '/dept/list')
          .then(response => {
            this.deptList = response.data.data;
            for (let i of this.deptList) {
              i.value = i.deptName;
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      // 获取分类
      async getClassifies() {
        this.$axios
          .get(host + '/classify/list')
          .then(response => {
            this.classifyList = response.data.data;
          })
          .catch(error => {
            console.log(error);
          });
      },

      // 删除平台
      async platformDelete() {
        this.$axios
          .delete(host + '/platform/delete/' + this.id)
          .then(response => {
            if (response.data.code === 0) {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success',
              });
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error',
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      // 修改平台信息
      async platformUpdate() {
        let data = {
          id: this.ruleForm.id,
          sort: this.ruleForm.sort,
          deptId: this.ruleForm.deptId,
          deptName: this.ruleForm.deptName,
          platformDesc: this.ruleForm.platformDesc,
          platformName: this.ruleForm.platformName,
          classifyId: this.ruleForm.classifyId,
          preEnv: this.ruleForm.preEnv,
          prodEnv: this.ruleForm.prodEnv,
          testEnv: this.ruleForm.testEnv,
          favicon: this.ruleForm.favicon,
        };
        this.$axios
          .post(host + '/platform/update', data)
          .then(response => {
            console.log(response);
            if (response.data.code === 0) {
              this.dialogFormVisible = false;
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success',
              });
              this.ruleForm = {};
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error',
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
            });
          });
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.platformUpdate();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        // this.ruleForm = {};
      },
      isNotEmpty(str) {
        return !this.isEmpty(str);
      },
      isEmpty(str) {
        if (str == null) {
          return true;
        } else if (str.length == 0) {
          return true;
        } else {
          return false;
        }
      },
    },
    mounted() {
      this.getDept();
      this.getClassifies();
    },
  };
</script>
<style>
  .el-row {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
  }

  .el-row .el-card {
    min-width: 10%;
    height: 150px;
    margin-right: 20px;
    transition: all 0.5s;
  }

  .el-col {
    border-radius: 4px;
  }

  .button-el {
    width: 100px;
  }

  .input-def-el {
    width: 100%;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .row-right {
    text-align: right;
  }

  .text {
    font-size: 14px;
  }

  .link-text {
    font-size: 15px;
    padding-left: 5px;
    padding-right: 5px;
  }

  .item {
    margin-bottom: 18px;
    line-height: 30px;
  }

  .moduletitle {
    width: 100%;
    color: #b4b4b4;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .imgs {
    width: 9%;
    margin-right: 3px;
  }

  .wrap {
    vertical-align: middle;
  }

  .wrap img {
    vertical-align: middle;
  }

  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 900;
    font-size: 18px;
    vertical-align: middle;
  }

  .addr {
    font-size: 12px;
    color: #b4b4b4;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }

  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 190%;
  }

  .tableTitle {
    position: relative;
    margin: 0 auto;
    width: 90%;
    height: 1px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
  }

  .midText {
    position: absolute;
    left: 50%;
    background-color: #ffffff;
    padding: 0 15px;
    transform: translateX(-50%) translateY(-50%);
  }
</style>
