<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <!--<el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="SysUserName">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" width="60" label="id">
            </el-table-column>
            <el-table-column prop="SysUserName" label="登陆名" sortable>
            </el-table-column>
            <el-table-column prop="SysUserGuid" label="SysUserGuid">
            </el-table-column>
            <el-table-column prop="SysUserPwd" label="密码">
            </el-table-column>
            <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                    <el-popover
                            ref="popover2"
                            placement="top"
                            title="密码"
                            width="200"
                            trigger="click"
                            :content="seePassword">
                    </el-popover>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑密码</el-button>
                    <el-button type="info" size="small" v-popover:popover2 @click="handleSeepw(scope.$index, scope.row)">查看密码</el-button>
                    <el-button type="danger" v-show="SysUserName && scope.row.SysUserName !== 'admin'" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" size="tiny" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="用户名" prop="SysUserName">
                    <el-input v-model="editForm.SysUserName" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="SysUserPwd">
                    <el-input v-model="editForm.SysUserPwd" auto-complete="off" @keyup.enter.native="editSubmit"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" size="tiny" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="用户名" prop="UserName">
                    <el-input v-model="addForm.UserName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="UserPwd">
                    <el-input v-model="addForm.UserPwd" auto-complete="off" @keyup.enter.native="addSubmit"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    // import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api';

    export default {
        data() {
            return {
                SysUserName: JSON.parse(sessionStorage.getItem('user')).SysUserName === 'admin',
                filters: {
                    name: ''
                },
                seePassword: '',
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    SysUserPwd: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    SysUserName: '',
                    SysUserPwd: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    UserName: '',
                    UserPwd: '',
                }

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                this.listLoading = true;
                //NProgress.start();
                this.axios.post('/user/userlist', {guid: sessionStorage.getItem('guid')}).then((result) => {
                    let data = JSON.parse(result.data)
                    this.total = data.length;
                    this.users = data;
                    this.listLoading = false;
                    //NProgress.done();
                }).catch((error) => {
                    console.error(error)
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该用户吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {UserName: row.SysUserName, guid: sessionStorage.getItem('guid')};
                    this.axios.post("/user/DeleteUser", para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message(res.data === 'ok' ? {
                            message: '删除成功',
                            type: 'success'
                        } : {
                            message: '删除失败',
                            type: 'error'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },
            //查看密码
            handleSeepw: function (index, row) {
                let para = {UserName: row.SysUserName, guid: sessionStorage.getItem('guid')}
                this.axios.post("/user/SeePwd", para).then((res) => {
                    this.editLoading = false;
                    this.seePassword = res.data
                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    UserName: '',
                    UserPwd: '',
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = {guid: sessionStorage.getItem('guid'), UserName: this.editForm.SysUserName, UserPwd: this.editForm.SysUserPwd};
                            this.axios.post("/user/UpdateUser", para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message(res.data === 'ok' ? {
                                    message: '修改成功',
                                    type: 'success'
                                } : {
                                    message: '修改失败',
                                    type: 'error'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getUsers();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({guid: sessionStorage.getItem('guid')}, this.addForm);
                        //para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        this.axios.post("/user/AddUser", para).then((res) => {
                            this.$message(res.data === 'ok' ? {
                                message: '新增成功',
                                type: 'success'
                            } : {
                                message: '新增失败',
                                type: 'error'
                            });
                            this.addLoading = false;
                            //NProgress.done();
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getUsers();
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getUsers();
        }
    }

</script>

<style scoped>

</style>