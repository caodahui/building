<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed ? '': sysName}}
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover" :show-timeout="1.5">
                    <span class="el-dropdown-link userinfo-inner">
                        {{sysUserName}}
                    <i class="el-icon-caret-bottom el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <!--<el-dropdown-item>我的消息</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>-->
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <el-menu :default-active="this.$route.path" router class="el-menu-vertical-demo" theme="dark" @open="handleOpen" @close="handleClose"
                     :collapse="collapsed">
                <template v-for="(item, index) in $router.options.routes[0].children">
                    <el-menu-item :index="item.path" :route="item">
                        <i :class="item.iconClass"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </template>
            </el-menu>

            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <h3 class="title">{{$route.name}}</h3>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        data() {
            return {
                sysName: '工地考勤系统',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                }
            }
        },
        created() {
            // console.log(this.$route.path)
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleselect: function (a, b) {
            },
            //退出登录
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
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            }
        },
        mounted() {
            var user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.SysUserName || '';
                this.sysUserAvatar = user.avatar || '../assets/user.png';
            }

        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: $color-primary;
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .el-dropdown{
                    .userinfo-inner {
                        cursor: pointer;
                        color: #fff;
                        img {
                            width: 40px;
                            height: 40px;
                            border-radius: 20px;
                            margin: 10px 10px 10px 10px;
                            float: left;
                        }
                        .el-icon-caret-bottom.el-icon--right{
                            float: right;
                            margin: 24px 0 0 10px;
                            vertical-align: middle;
                            transition: all 0.5s;
                        }
                    }
                    &:hover{
                        .userinfo-inner {
                            .el-icon-caret-bottom.el-icon--right {
                                -moz-transform:scaleY(-1);
                                -webkit-transform:scaleY(-1);
                                -o-transform:scaleY(-1);
                                transform:scaleY(-1);
                                /*IE*/
                                filter:FlipV;
                            }
                        }
                    }
                }
            }
            .logo {
                //width:230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px;
                transition: all 0.3s ease-in;
            }
            .logo-collapse-width {
                width: 64px;
                transition: all 0.3s ease-in;
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
                i {
                    font-size: 18px;
                }
            }
        }
        .main {
            display: flex;
            // background: #324057;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;
            .el-menu-vertical-demo:not(.el-menu--collapse) {
                width: 230px;
                min-height: 400px;
            }
            .el-menu-item {
                i {
                    margin-right: 5px;
                    width: 24px;
                    text-align: center;
                    vertical-align: middle;
                }
            }
            .content-container {
                flex: 1;
                h3 {
                    margin: 0 0 7px 0;
                }
                overflow-y: scroll;
                padding: 20px;
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }
</style>