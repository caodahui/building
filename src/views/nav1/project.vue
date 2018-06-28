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
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" width="60" label="id">
            </el-table-column>
            <el-table-column prop="ProjectName" label="项目名称" sortable>
            </el-table-column>
            <el-table-column prop="ProjectGUID" label="ProjectGUID" sortable>
            </el-table-column>
            <!--<el-table-column prop="Appid" label="Appid">
            </el-table-column>
            <el-table-column prop="AppSecret" label="AppSecret">
            </el-table-column>-->
            <el-table-column prop="ProjectRemark" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--编辑界面-->
        <el-dialog title="编辑" size="tiny" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="项目名称" prop="ProjectName">
                    <el-input v-model="editForm.ProjectName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目说明">
                    <el-input type="textarea" v-model="editForm.ProjectRemark" :rows="4" @keyup.enter.native="editSubmit"></el-input>
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
                <el-form-item label="项目名称" prop="ProjectName">
                    <el-input v-model="addForm.ProjectName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目说明">
                    <el-input type="textarea" v-model="addForm.ProjectRemark" :rows="4" @keyup.enter.native="addSubmit"></el-input>
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

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    ProjectName: '',
                    ProjectRemark: '',
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
                    ProjectName: '',
                    ProjectRemark: '',
                }

            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                let para = {guid: sessionStorage.getItem('guid')};
                this.listLoading = true;
                //NProgress.start();
                this.axios.post("/project/projectlist", para).then((res) => {
                    let data = JSON.parse(res.data)
                    this.total = res.data.total;
                    this.users = data;
                    this.listLoading = false;
                    //NProgress.done();
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
                    ProjectName: '',
                    ProjectRemark: '',
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.editLoading = true;
                        //NProgress.start();
                        let para = Object.assign(
                            {guid: sessionStorage.getItem('guid')},
                            {ProjectName: this.editForm.ProjectName, ProjectRemark: this.editForm.ProjectRemark, ProjectGUID: this.editForm.ProjectGUID}
                        );
                        this.axios.post("/Project/UpdateProject", para).then((res) => {
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
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '新增后无法删除', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign(
                                {guid: sessionStorage.getItem('guid')},
                                {ProjectName: this.addForm.ProjectName, ProjectRemark: this.addForm.ProjectRemark}
                            );
                            this.axios.post("/project/AddProject", para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message(res.data === 'ok' ? {
                                    message: '新增成功',
                                    type: 'success'
                                } : {
                                    message: '新增失败',
                                    type: 'error'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
                            });
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