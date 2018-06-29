/**
 * Created by addy on 2018/6/14
 */

import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import '../static/config'
// import VueAxios from 'vue-axios'
window.baseUrl = config.httpUrl    //'http://localhost:8081'

var instance = axios.create({
    baseURL: baseUrl,
    transformRequest: [function (data) {
        data = data || {}
        return qs.stringify(data);
    }],
    validateStatus: function (status) {
        /*if (status === 401) {
            let url = window.location.origin + "/login"
            window.location.href = url
        }*/
        return status
    },
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    // withCredentials: true
});

Vue.prototype.axios = instance