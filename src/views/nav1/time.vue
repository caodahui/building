<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="filters">
                <el-form-item prop="ProjectNameValue">
                    <el-select v-model="filters.ProjectNameValue" placeholder="项目" @change="projectChange">
                        <el-option
                                key="ALL"
                                label="全部"
                                value="ALL">
                        </el-option>
                        <el-option
                                v-for="item in filters.ProjectName"
                                :key="item.ProjectName + '_' + item.ProjectGUID"
                                :label="item.ProjectName"
                                :value="item.ProjectName + '_' + item.ProjectGUID">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="DeptNameValue">
                    <el-select v-model="filters.DeptNameValue" placeholder="部门">
                        <el-option
                                key="ALL"
                                label="全部"
                                value="ALL">
                        </el-option>
                        <el-option
                                v-for="item in filters.DeptName"
                                :key="item.DeptName"
                                :label="item.DeptName"
                                :value="item.DeptName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="TeamNameValue">
                    <el-select v-model="filters.TeamNameValue" placeholder="班组">
                        <el-option
                                key="ALL"
                                label="全部"
                                value="ALL">
                        </el-option>
                        <el-option
                                v-for="item in filters.TeamName"
                                :key="item.TeamName"
                                :label="item.TeamName"
                                :value="item.TeamName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="UserIDCardNumber">
                    <el-input v-model="filters.UserIDCardNumber" placeholder="身份证号"></el-input>
                </el-form-item>
                <el-form-item label-width="180px" prop="date">
                    <!--<el-date-picker
                            v-model="filters.date"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="date"
                            range-separator="&#45;&#45;"
                            format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>-->
                    <el-date-picker
                            v-model="filters.date"
                            type="date"
                            @change="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="search">查询</el-button>
                    <el-button @click="reset">重置</el-button>
                    <el-button @click="exportXls">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="expand">
                <template scope="props">
                    <el-table :data="props.row.timeList" style="width: 100%;">
                        <el-table-column prop="inout" label="进 / 出">
                        </el-table-column>
                        <el-table-column prop="time" label="时间">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column type="index" width="60" label="id">
            </el-table-column>
            <el-table-column prop="UserName" label="姓名">
            </el-table-column>
            <el-table-column prop="TimeCount" label="工时">
            </el-table-column>

            <!--<el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" type="danger" @click="handleEdit(scope.$index, scope.row)">设置黑名单</el-button>
                </template>
            </el-table-column>-->
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <!--<el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="users.length">
            </el-pagination>-->
        </el-col>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import '../../../static/config'

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
                    UserIDCardNumber: '',
                    date: this.getTime().today
                },
                users: [],
                currentPage: 1,
                pagesize: 20,
                listLoading: false,
                config: config,
                // sels: [],//列表选中列
            }
        },
        mounted() {
            this.getProject()
            /*this.getDept()
            this.getTeam()
            this.getUsers({
                ProjectName: this.filters.ProjectNameValue,
                DeptName: 'ALL',
                TeamName: 'ALL',
                UserIDCardNumber: '',
                StartTime: this.filters.date[0],
                EndTime: this.filters.date[1]
            })*/
        },
        methods: {
            date(date) {
                console.log(date)
                this.filters.date = date
            },
            fomatTime(time) {
                return [time + ' 00:00:00', time + ' 23:59:59']
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
            exportXls() {//导出
                let date = this.fomatTime(this.filters.date)
                let param = {
                    ProjectName: this.filters.ProjectNameValue === 'ALL' || this.filters.ProjectNameValue === '' ? 'ALL' : this.filters.ProjectNameValue.split('_')[1],
                    DeptName: this.filters.DeptNameValue === '' ? 'ALL' : this.filters.DeptNameValue,
                    TeamName: this.filters.TeamNameValue === '' ? 'ALL' : this.filters.TeamNameValue,
                    UserIDCardNumber: this.filters.UserIDCardNumber,
                    StartTime: date[0],
                    EndTime: date[1],
                    guid: sessionStorage.getItem('guid')
                }

                this.axios.post('/inout/counttimetoExcel', param).then((result) => {
                    window.open(config.httpUrl + '/' + result.data)
                    //NProgress.done();
                }).catch((error) => {
                    console.error(error)
                })
            },
            projectChange(val) {  //项目过滤下拉的 点击
                let id = val.split('_')[1]
                let name = val.split('_')[0]
                this.getDept(id)
                this.getTeam(id)
                console.log(this.filters.date)
                let date = this.fomatTime(this.filters.date)
                this.getUsers({
                    ProjectName: id,
                    DeptName: 'ALL',
                    TeamName: 'ALL',
                    UserIDCardNumber: '',
                    StartTime: date[0],
                    EndTime: date[1]
                })
            },
            getProject() {  //获取条件之  项目
                this.listLoading = true;
                this.axios.post('/project/projectlist', {guid: sessionStorage.getItem('guid')}).then((result) => {
                    var data = JSON.parse(result.data)
                    this.filters.ProjectName = data;
                    this.filters.ProjectNameValue = data.length > 0 ? data[0].ProjectName + '_' + data[0].ProjectGUID : ''
                    this.listLoading = false;
                    //NProgress.done();
                }).catch((error) => {
                    console.error(error)
                })
            },
            getDept(id) {  //获取条件之  所有部门
                this.listLoading = true;
                let url = id ? '/dept/deptlist' : '/dept/DeptListAll'
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
                let url = id ? '/team/teamlist' : '/team/teamlistAll'
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
                let date = this.fomatTime(this.filters.date)
                this.getUsers({
                    ProjectName: this.filters.ProjectNameValue === 'ALL' || this.filters.ProjectNameValue === '' ? 'ALL' : this.filters.ProjectNameValue.split('_')[1],
                    DeptName: this.filters.DeptNameValue === '' ? 'ALL' : this.filters.DeptNameValue,
                    TeamName: this.filters.TeamNameValue === '' ? 'ALL' : this.filters.TeamNameValue,
                    UserIDCardNumber: this.filters.UserIDCardNumber,
                    StartTime: date[0],
                    EndTime: date[1]
                })
            },
            reset() { //重置条件
                this.$refs.filters.resetFields();
                let date = this.fomatTime(this.filters.date)
                this.getUsers({
                    ProjectName: 'ALL',
                    DeptName: 'ALL',
                    TeamName: 'ALL',
                    UserIDCardNumber: '',
                    StartTime: date[0],
                    EndTime: date[1]
                })

            },
            getUsers(params) {
                let param = Object.assign({guid: sessionStorage.getItem('guid')}, params);
                this.listLoading = true;
                this.axios.post('/inout/CountTime', param).then((result) => {
                    var data = JSON.parse(result.data)
                    this.total = data.length;
                    this.users = data;
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
                    this.axios.post("/emp/EmployessBlack", para).then((res) => {
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
    .el-date-editor--daterange.el-input {
        width: 335px;
    }
</style>