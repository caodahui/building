<template>
    <div id="login">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
                 class="demo-ruleForm login-container">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="account">
                <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"
                          placeholder="密码"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2"
                           :loading="logining">登录
                </el-button>
                <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    // import {requestLogin} from '../api';
    import NProgress from 'nprogress'
    import qs from 'qs'

    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    account: 'admin',
                    checkPass: '123456'
                },
                rules2: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        // {validator: validaePass}
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        // {validator: validaePass2}
                    ]
                },
                checked: true
            };
        },
        created() {

        },
        methods: {
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    this.axios.post('/user/loginout', {guid: sessionStorage.getItem('guid')}).then((result) => {
                        sessionStorage.removeItem('guid');
                        _this.$router.push('/login');
                    })
                }).catch(() => {

                });

            },
            handleSubmit2(ev) {
//                this.logout()
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        NProgress.start();
                        let loginParams = {UserName: this.ruleForm2.account, UserPwd: this.ruleForm2.checkPass};
                        this.axios.post('/user/Login', {UserName: this.ruleForm2.account, UserPwd: this.ruleForm2.checkPass}).then((result) => {
                            NProgress.done();
                            this.logining = false;
                            if (result.data === 'is online') {
                                this.$message({
                                    message: '已经是登录状态！',
                                    type: 'warning'
                                });
                                this.$router.push({path: '/user'});
                            } else {
                                let data = JSON.parse(result.data)
                                if (data.status === 'ok') {
                                    sessionStorage.setItem('guid', data.guid);
                                    sessionStorage.setItem('user', JSON.stringify(data.user));
                                    this.$message({
                                        message: '登陆成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/user'});
                                } else {
                                    this.$message.error('登陆失败');
                                }
                            }
                        }).catch(error => {
                            console.error(error)
                        })
                        // this.axios.post(`http://localhost:8080/gd/user/loginout`, loginParams).then(res => res.data)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    #login {
        width: 100%;
        height: 100%;
        background: url("../assets/login_bg.svg") center 110px rgb(240, 242, 245) no-repeat;
        background-size: 100%;
        overflow: hidden;
        .login-container {
            /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
            -webkit-border-radius: 5px;
            border-radius: 5px;
            -moz-border-radius: 5px;
            background-clip: padding-box;
            margin: 12% auto 0 auto;
            width: 350px;
            padding: 35px 35px 15px 35px;
            background: #fff;
            border: 1px solid #eaeaea;
            box-shadow: 0 0 25px #cac6c6;
            .title {
                margin: 0px auto 40px auto;
                text-align: center;
                color: #505458;
            }
            .remember {
                margin: 0px 0px 35px 0px;
            }
        }
    }
</style>