/**
 * Created by addy on 2018/6/14
 */

import Vue from 'vue'
import axios from 'axios'

window.localPath = 'http://localhost:8080/gd';
axios.defaults.withCredentials = true;
axios.defaults.headers['content-type'] = 'application/xxxx-form'
Vue.prototype.axios = axios