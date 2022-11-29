<template>
  <div>
    <div>
      <el-row :gutter="40">
        <el-col :span="4">
          <el-input v-model="platformName" placeholder="请输入平台名称" style="margin-left: 8px; width: 100%" @keyup.enter.native="platformList"></el-input>
        </el-col>
        <el-col :span="4">
          <el-autocomplete class="input-def-el" v-model="deptName" :fetch-suggestions="querySearchAsync" placeholder="请输入部门/组织名称" @select="handleSelect"></el-autocomplete>
        </el-col>
        <el-col :span="4">
          <el-select v-model="classifyId" placeholder="请选择平台分类" class="input-def-el">
            <el-option label="全部分类" value=""></el-option>
            <el-option v-for="item in classifyList" :key="item.classifyId" :label="item.classifyName" :value="item.classifyId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-button class="button-el" type="primary" icon="el-icon-search" @click="platformList()">搜索</el-button>
          <el-button class="button-el" style="margin-left: 30px" type="primary" @click="dialogFormVisible = true">新增</el-button>
          <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
              <el-form-item label="平台描述" prop="platformDesc">
                <el-input type="textarea" v-model="ruleForm.platformDesc" placeholder="请选择平台描述"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- <el-button type="primary" @click="platformAdd()" -->
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <!-- <el-button @click="resetForm()">重置</el-button> -->
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
    <div class="tableTitle"><span class="midText">查询结果</span></div>
    <br />
    <div style="margin-left: -8%; margin-right: 8%">
      <el-row :gutter="1" type="flex" justify="start">
        <el-col :span="2" v-for="(item, index) in platformData" :key="index" :offset="2">
          <el-card class="box-card" shadow="always" body-style="padding-top: 20px;">
            <div slot="header" class="clearfix">
              <div class="wrap">
                <img class="imgs" v-if="isNotEmpty(item.favicon)" v-bind:src="item.favicon" alt="" />
                <span class="name">{{ item.platformName }}</span>
                <!-- <span v-if= "item.platformName === '服务治理'">🌟🌟🌟</span> -->
              </div>
              <!-- <span class="addr">{{ item.platformDesc }}</span> -->
              <!-- <span class="addr">（{{ item.deptName }}）</span> -->
              <!-- <span class="addr moduletitle" :title="item.desc">{{
                item.desc
              }}</span> -->
              <div class="moduletitle" :title="item.desc">
                {{ item.desc }}
              </div>
              <!-- <el-button style="float: right; padding: 3px 0" type="text"
                >修改</el-button
              > -->
            </div>

            <div class="text item">
              <el-link type="primary" v-bind:href="item.testEnv" target="_blank" v-if="isNotEmpty(item.testEnv)" :underline="false">
                <span class="link-text">测试</span>
              </el-link>
              <el-link type="primary" v-bind:href="item.preEnv" target="_blank" v-if="isNotEmpty(item.preEnv)" :underline="false">
                <span class="link-text">预发</span>
              </el-link>
              <el-link type="primary" v-bind:href="item.prodEnv" target="_blank" v-if="isNotEmpty(item.prodEnv)" :underline="false">
                <span class="link-text">正式</span>
              </el-link>
            </div>

            <!-- <div class="text item" v-if="isNotEmpty(item.testEnv)">
              <el-link
                type="primary"
                v-bind:href="item.testEnv"
                target="_blank"
              >
                <span class="link-text">测试环境</span>
              </el-link>
            </div>
            <div class="text item" v-if="isNotEmpty(item.preEnv)">
              <el-link type="primary" v-bind:href="item.preEnv" target="_blank">
                <span class="link-text">预发环境</span></el-link
              >
            </div>
            <div class="text item" v-if="isNotEmpty(item.prodEnv)">
              <el-link
                type="primary"
                v-bind:href="item.prodEnv"
                target="_blank"
              >
                <span class="link-text">正式环境</span></el-link
              >
            </div> -->
          </el-card>
          <br />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  console.log(process.env);
  var host = process.env.VUE_APP_HOST;
  export default {
    data() {
      return {
        platformData: [], // 总数据
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
          deptName: '',
          platformDesc: '',
          platformName: '',
          classifyId: '',
          classifyName: '',
          preEnv: '',
          testEnv: '',
          prodEnv: '',
        },
        rules: {
          platformName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            {
              min: 1,
              max: 50,
              message: '长度在 1 到 50 个字符',
              trigger: 'blur',
            },
          ],
          classifyId: [{ required: true, message: '请输入平台分类', trigger: 'blur' }],
          deptName: [
            {
              required: true,
              message: '请输入部门/组织名称',
              trigger: 'changer',
            },
          ],
          platformDesc: [
            { required: true, message: '请输入平台描述', trigger: 'changer' },
            {
              min: 1,
              max: 100,
              message: '长度在 1 到 100 个字符',
              trigger: 'blur',
            },
          ],
        },
      };
    },
    methods: {
      // 每页显示的条数改变
      changeSizeHandle(val) {
        this.size = val; // 改变每页显示的条数
        this.currentPage = 1; // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.getInfo(); // 点击每页显示的条数时，显示第一页
        console.log(`每页 ${val} 条`);
      },

      // current-change用于监听页数改变，而内容也发生改变
      currentChangeHandle(val) {
        this.currentPage = val; // 改变默认的页数
        this.getInfo(); // 切换页码时，要获取每页显示的条数
        console.log(`当前页: ${val}`);
      },

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
      // 查询平台列表
      async platformList() {
        let api = '/platform/list';
        let data = {
          deptName: this.deptName,
          platformName: this.platformName,
          classifyName: this.classifyName,
          classifyId: this.classifyId,
        };
        this.$axios
          .get(host + api, {
            params: data,
          })
          .then(response => {
            this.platformData = response.data.data;
            for (let i of this.platformData) {
              i.desc = i.platformDesc + '（' + i.deptName + '）';
            }
          })
          .catch(error => {
            console.log(error);
          });
        this.countTime(api, JSON.stringify(data));
      },
      // 新增平台
      async platformAdd() {
        let api = '/platform/add';
        let data = {
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
          .post(host + api, data)
          .then(response => {
            console.log(response);
            if (response.data.code === 0) {
              this.dialogFormVisible = false;
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success',
              });
              this.ruleForm = {};
              this.platformList();
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
        this.countTime(api, JSON.stringify(data)).then(r => console.log(r),);
      },
      async countTime(var1, var2) {
        let data = {
          api: var1,
          requestBody: var2,
          userAgent: navigator.userAgent.toLowerCase(),
        };
        this.$axios
          .post(host + '/count/time', data)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.platformAdd();
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
      this.platformList();
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
