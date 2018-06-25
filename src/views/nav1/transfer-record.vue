<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-select v-model="filters.ProjectNameValue" placeholder="项目">
                    <el-option
                            v-for="item in filters.ProjectName"
                            :key="item.ProjectGUID"
                            :label="item.ProjectName"
                            :value="item.ProjectGUID">
                    </el-option>
                </el-select>

                <el-select v-model="filters.DeptNameValue" placeholder="部门">
                    <el-option
                            v-for="item in filters.DeptName"
                            :key="item.DeptGUID"
                            :label="item.DeptName"
                            :value="item.DeptGUID">
                    </el-option>
                </el-select>

                <el-select v-model="filters.TeamNameValue" placeholder="班组">
                    <el-option
                            v-for="item in filters.TeamName"
                            :key="item.TeamGUID"
                            :label="item.TeamName"
                            :value="item.TeamGUID">
                    </el-option>
                </el-select>

                <el-form-item>
                    <el-input v-model="filters.CardNo" placeholder="卡号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                            v-model="filters.date"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="date"
                            range-separator="--">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" width="60" label="id">
            </el-table-column>

            <el-table-column prop="UserName" width="120" label="姓名" sortable>
            </el-table-column>
            <el-table-column prop="UserSex" width="120" label="性别" sortable>
            </el-table-column>
            <el-table-column prop="TeamGUID" width="120" label="班组名称" sortable>
            </el-table-column>
            <el-table-column prop="DeptGUID" width="120" label="部门名称" sortable>
            </el-table-column>
            <el-table-column prop="WorkNumber" width="180" label="工号" sortable>
            </el-table-column>
            <el-table-column prop="CardNumber" width="180" label="卡号" sortable>
            </el-table-column>
            <el-table-column prop="QuantumGUID" width="180" label="上班时间段">
            </el-table-column>
            <el-table-column prop="state" width="120" label="人员状态" sortable>
            </el-table-column>
            <el-table-column prop="ProjectGUID" width="180" label="项目编号">
            </el-table-column>
            <el-table-column prop="UserIDCardNumber" width="180" label="身份证号">
            </el-table-column>
            <el-table-column prop="UserBrithday" width="180" label="出生日期">
            </el-table-column>
            <el-table-column prop="UserNation" width="120" label="民族">
            </el-table-column>
            <el-table-column prop="UserAddress" width="120" label="地址">
            </el-table-column>
            <el-table-column prop="Effective" width="120" label="身份证有效期">
            </el-table-column>
            <el-table-column prop="UserImage" width="120" label="身份证头像">
            </el-table-column>
            <el-table-column prop="Organ" width="120" label="原地">
            </el-table-column>
            <el-table-column prop="IsDown" width="180" label="是否要向下更新">
            </el-table-column>

            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" type="danger" @click="handleEdit(scope.$index, scope.row)">设置黑名单</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    // import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    function zero(date) {
        return date < 10 ? '0' + date : date
    }

    export default {
        data() {
            return {
                filters: {  //过滤字段
                    ProjectName: [],
                    DeptName: [],
                    TeamName: [],
                    ProjectNameValue: '',
                    DeptNameValue: '',
                    TeamNameValue: '',
                    CardNo: '',
                    date: [this.getTime().yesterday, this.getTime().today]
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                // sels: [],//列表选中列
            }
        },
        mounted() {
            this.getProject()
            this.getDept()
            this.getTeam()
        },
        methods: {
            date(date) {
                console.log(date)
            },
            getTime() {
                //昨天的时间
                var day1 = new Date();
                day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
                var s1 = day1.getFullYear() + "-" + zero(day1.getMonth() + 1) + "-" + zero(day1.getDate());
                //今天的时间
                var day2 = new Date();
                day2.setTime(day2.getTime());
                var s2 = day2.getFullYear() + "-" + zero(day2.getMonth() + 1) + "-" + zero(day2.getDate());
                return {
                    yesterday: s1,
                    today: s2
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers({
                    ProjectName: 'ALL',
                    DeptName: 'ALL',
                    TeamName: 'ALL',
                    CardNo: ''
                });
            },
            projectChange(val) {  //项目过滤下拉的 点击
                this.getDept(val)
                this.getTeam(val)
                this.getUsers({
                    ProjectName: val,
                    DeptName: 'ALL',
                    TeamName: 'ALL',
                    CardNo: ''
                })
            },
            getProject() {  //获取条件之  项目
                this.listLoading = true;
                this.axios.post('/api/project/projectlist', {guid: sessionStorage.getItem('guid')}).then((result) => {
                    var data = JSON.parse(result.data)
                    this.filters.ProjectName = data;
                    this.filters.ProjectNameValue = data.length > 0 ? data[0].ProjectGUID : ''
                    this.getUsers({
                        ProjectName: this.filters.ProjectNameValue,
                        DeptName: 'ALL',
                        TeamName: 'ALL',
                        CardNo: '',
                        StartTime: this.filters.date[0],
                        EndTime: this.filters.date[1]
                    });
                    this.listLoading = false;
                    //NProgress.done();
                }).catch((error) => {
                    console.error(error)
                })
            },
            getDept(id) {  //获取条件之  所有部门
                this.listLoading = true;
                let url = id ? '/api/dept/deptlist' : '/api/dept/DeptListAll'
                let parms = id ? {guid: sessionStorage.getItem('guid'), ProjectGUID: id} : {guid: sessionStorage.getItem('guid')}
                this.axios.post(url, parms).then((result) => {
                    var data = JSON.parse(result.data)
                    this.filters.DeptName = data;
                    this.listLoading = false;
                    //NProgress.done();
                }).catch((error) => {
                    console.error(error)
                })
            },
            getTeam(id) {  //获取条件之  所有班组
                this.listLoading = true;
                let parms = id ? {guid: sessionStorage.getItem('guid'), ProjectGUID: id} : {guid: sessionStorage.getItem('guid')}
                let url = id ? '/api/team/teamlist' : '/api/team/teamlistAll'
                this.axios.post(url, parms).then((result) => {
                    var data = JSON.parse(result.data)
                    this.filters.TeamName = data;
                    this.listLoading = false;
                    //NProgress.done();
                }).catch((error) => {
                    console.error(error)
                })
            },
            search() {
                this.getUsers({
                    ProjectName: this.filters.ProjectNameValue === '' ? 'ALL' : this.filters.ProjectNameValue,
                    DeptName: this.filters.DeptNameValue === '' ? 'ALL' : this.filters.DeptNameValue,
                    TeamName: this.filters.TeamNameValue === '' ? 'ALL' : this.filters.TeamNameValue,
                    CardNo: this.filters.CardNo
                })
            },
            getUsers(params) {
                let param = Object.assign({guid: sessionStorage.getItem('guid')}, params);
                this.listLoading = true;
                this.axios.post('/api/inout/record', param).then((result) => {
                    var data = JSON.parse(result.data)
                    this.total = data.length;
                    this.users = result.data;
                    this.listLoading = false;
                    //NProgress.done();
                }).catch((error) => {
                    console.error(error)
                })
            },
            //设置黑名单
            handleEdit: function (index, row) {
                this.$confirm('确认要设置黑名单吗?', '', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    this.axios.post("/api/emp/EmployessBlack", para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message(res.data === 'ok' ? {
                            message: '操作成功',
                            type: 'success'
                        } : {
                            message: '操作失败',
                            type: 'error'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

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
        }
    }

</script>

<style scoped>

</style>