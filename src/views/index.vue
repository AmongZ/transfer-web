<template>
    <div>
        <el-card>
            <el-input v-model="platformName" placeholder="请输入平台名称"
                      style="margin: 0 0 5px 0; width: 15%; float: left"
                      @input="platformList"></el-input>
            <el-radio-group v-model="teamName" size="medium" @input="platformList"
                            style="margin: 2px 0 5px 10px; float: left">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button v-for="item in teamList"
                                 :key="item.teamName"
                                 :label="item.teamName"></el-radio-button>
            </el-radio-group>
            <el-button plain class="button-el" style="margin-right: 30px; float: right" type="primary"
                       v-if="!edit"
                       @click="addPlatform()">新增
            </el-button>
        </el-card>
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="平台名称" prop="platformName">
                    <el-input v-model="ruleForm.platformName" placeholder="请输入平台名称"></el-input>
                </el-form-item>
                <el-form-item label="归属部门" prop="teamName">
                    <el-select v-model="ruleForm.teamName" placeholder="请选择归属部门" class="input-def-el">
                        <el-option v-for="item in teamList" :key="item.id" :label="item.teamName"
                                   :value="item.teamName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台分类" prop="classifyId">
                    <el-select v-model="ruleForm.classifyId" placeholder="请选择平台分类" class="input-def-el">
                        <el-option v-for="item in classifyList" :key="item.id" :label="item.classifyName"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开发环境地址" prop="testEnv">
                    <el-input v-model="ruleForm.devEnv"></el-input>
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
                    <el-button type="primary" @click="submitForm('ruleForm')">{{ buttonName }}</el-button>
                    <el-button @click="dialogFormVisible=false">关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-card>
            <div v-for="(platformData, index) in teamPlatformDate" :key="index">
                <el-divider content-position="left"><span style="color: #E6A23C">{{ platformData.team }}</span>
                </el-divider>
                <div>
                    <el-row :gutter="8">
                        <el-col :span="4" style="height: 118px" v-for="(item, index) in platformData.platformResponses"
                                :key="index">
                            <el-card style="width: 100%; height: 110px; ">
                                <div slot="header" class="clearfix">
                                    <div v-if="edit" style="float: right">
                                        <el-button type="text" size="mini" @click="editPlatform(item)">修改</el-button>
                                        <el-popconfirm
                                                confirm-button-text='是'
                                                @confirm="delPlatform(item)"
                                                cancel-button-text='否'
                                                icon="el-icon-info"
                                                icon-color="red"
                                                title="确认删除？"
                                        >
                                            <el-button type="text" size="mini" slot="reference" style="color: #F56C6C">
                                                删除
                                            </el-button>
                                        </el-popconfirm>
                                    </div>
                                    <div class="wrap">
                                        <img class="imgs" v-if="isNotEmpty(item.favicon)" v-bind:src="item.favicon"
                                             alt=""/>
                                        <span class="name">{{ item.platformName }}</span>
                                    </div>
                                    <div class="moduletitle" :title="item.desc">
                                        {{ item.desc }}
                                    </div>
                                </div>

                                <div class="text item">
                                    <el-link type="primary" v-bind:href="item.devEnv" target="_blank"
                                             v-if="isNotEmpty(item.devEnv)"
                                             :underline="false">
                                        <span class="link-text" @click="handleClick(item, 'dev')">开发</span>
                                    </el-link>
                                    <el-link type="primary" v-bind:href="item.testEnv" target="_blank"
                                             v-if="isNotEmpty(item.testEnv)"
                                             :underline="false">
                                        <span class="link-text" @click="handleClick(item, 'test')">测试</span>
                                    </el-link>
                                    <el-link type="primary" v-bind:href="item.preEnv" target="_blank"
                                             v-if="isNotEmpty(item.preEnv)"
                                             :underline="false">
                                        <span class="link-text" @click="handleClick(item, 'pre')">预发</span>
                                    </el-link>
                                    <el-link type="primary" v-bind:href="item.prodEnv" target="_blank"
                                             v-if="isNotEmpty(item.prodEnv)"
                                             :underline="false">
                                        <span class="link-text" @click="handleClick(item, 'prod')">正式</span>
                                    </el-link>
                                </div>
                            </el-card>
                            <br/>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
const host = process.env.VUE_APP_HOST;
export default {
    data() {
        return {
            teamPlatformDate: [], // 总数据
            teamName: '全部',
            platformName: '',
            classifyId: '',
            classifyName: '',
            teamList: [],
            classifyList: [],
            restaurants: [],
            timeout: null,
            dialogTableVisible: false,
            dialogFormVisible: false,
            buttonName: '立即创建',
            ruleForm: {
                teamName: '',
                platformDesc: '',
                platformName: '',
                classifyId: '',
                classifyName: '',
                preEnv: '',
                testEnv: '',
                devEnv: '',
                prodEnv: '',
            },
            rules: {
                platformName: [
                    {required: true, message: '请输入平台名称', trigger: 'blur'},
                    {
                        min: 1,
                        max: 50,
                        message: '长度在 1 到 50 个字符',
                        trigger: 'blur',
                    },
                ],
                classifyId: [{required: true, message: '请输入平台分类', trigger: 'blur'}],
                teamName: [
                    {
                        required: true,
                        message: '请输入部门/组织名称',
                        trigger: 'changer',
                    },
                ],
                platformDesc: [
                    {required: true, message: '请输入平台描述', trigger: 'changer'},
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
    props: {
        edit: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        // 获取分类
        async getClassifies() {
            this.$axios
                .get(host + '/platform/classify/list')
                .then(response => {
                    this.classifyList = response.data.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // 查询平台列表
        async platformList() {
            let api = '/platform/team/list';
            let data = {
                platformName: this.platformName,
                classifyId: this.classifyId,
                teamName: this.teamName === '全部' ? '' : this.teamName,
            };
            this.$axios
                .get(host + api, {
                    params: data,
                })
                .then(response => {
                    this.teamPlatformDate = response.data.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // 新增平台
        async platformAdd() {
            let api = '/platform/add';
            let data = {
                id: this.ruleForm.id,
                platformDesc: this.ruleForm.platformDesc,
                platformName: this.ruleForm.platformName,
                teamName: this.ruleForm.teamName,
                classifyId: this.ruleForm.classifyId,
                preEnv: this.ruleForm.preEnv,
                prodEnv: this.ruleForm.prodEnv,
                testEnv: this.ruleForm.testEnv,
                devEnv: this.ruleForm.devEnv,
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
                            message: '操作成功',
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
        },
        // 新增埋点
        async addHit(params) {
            let api = '/hit/add';
            this.$axios
                .post(host + api, params)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // 新增埋点
        async getTeam() {
            let api = '/team/list';
            this.$axios
                .get(host + api)
                .then(response => {
                    this.teamList = response.data.data;
                    console.log(this.teamList)
                })
                .catch(error => {
                    console.log(error);
                });
        },
        editPlatform(row) {
            this.buttonName = '修改';
            this.ruleForm = row;
            this.dialogFormVisible = true;
        },
        delPlatform(row) {
            console.log(JSON.stringify(row));
            let api = "/platform/delete";
            this.$axios
                .delete(host + api, {
                    params: {id: row.id},
                })
                .then(response => {
                    console.log(response);
                    if (response.data.code === 0) {
                        this.dialogFormVisible = false;
                        this.$message({
                            showClose: true,
                            message: '删除成功',
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
        },
        addPlatform() {
            this.buttonName = '立即创建';
            this.dialogFormVisible = true;
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
        handleClick(val, env) {
            console.log(env, val)
            const params = {
                platformId: val.id,
                env: env,
                event: 'HIT',
                operator: val.operator ? val.operator : '',
            };
            this.addHit(params)
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
            } else return str.length === 0;
        },
    },
    mounted() {
        this.platformList();
        this.getClassifies();
        this.getTeam();
    },
};
</script>

<style>
.el-divider--horizontal {
    margin: 15px 0;
    /*box-shadow: 1px 1px 5px #d9d7d7;*/
    /*background: 0 0;*/
    /*border-top: 1px dashed #e8eaec;*/
}

.el-card {
    margin-top: 5px;
}

.el-card .el-row {
    margin-bottom: 0;
}

.el-card__header {
    padding: 10px 10px;
}

.el-card__body {
    padding: 5px 10px;
}

.item {
    line-height: 35px;
}

.el-row .el-card {
    min-width: 100%;
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

.moduletitle {
    width: 100%;
    color: #b4b4b4;
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 3px;
}

.imgs {
    width: 8%;
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
    font-size: 16px;
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
