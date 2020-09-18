import Vue from "vue";
import Vuex from "vuex";
import request from "../utils/request";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    getrmltList() {
      return request({
        url: "http://localhost:3000/rmltlist"
      })
        .then(res => {
          return res;
        })
        .catch(err => {
          throw err;
        });
    },
    getNeteaseList() {
      return request({
        url: "http://localhost:3000/neteaselist"
      })
        .then(res => {
          console.log(res);
          return res;
        })
        .catch(err => {
          throw err;
        });
    },
    getcctvList() {
      return request({
        url: "http://localhost:3000/cctvlist"
      })
        .then(res => {
          return res;
        })
        .catch(err => {
          throw err;
        });
    },
    getTencentList() {
      return request({
        url: "http://localhost:3000/tencentlist"
      })
        .then(res => {
          console.log(res);
          return res;
        })
        .catch(err => {
          throw err;
        });
    },
    getNeteaseDetail(commit, u) {
      console.log("u", u);
      let data = {
        href: "https://news.163.com/" + u
      };
      console.log(data);
      return request({
        url: "http://localhost:3000/neteaseDetail",
        data,
        method: "POST"
      })
        .then(res => {
          console.log(res);
          return res;
        })
        .catch(err => {
          throw err;
        });
    },
    getTencentDetail(commit, u) {
      console.log("u", u);
      let data = {
        href: "https://new.qq.com/" + u
      };
      console.log(data);
      return request({
        url: "http://localhost:3000/tencentDetail",
        data,
        method: "POST"
      })
        .then(res => {
          console.log(res);
          return res;
        })
        .catch(err => {
          throw err;
        });
    },
    getcctvDetail(commit, u) {
      console.log("u", u);
      let data = {
        href: "http://news.cctv.com/" + u
      };
      console.log(data);
      return request({
        url: "http://localhost:3000/cctvDetail",
        data,
        method: "POST"
      })
        .then(res => {
          console.log(res);
          return res;
        })
        .catch(err => {
          throw err;
        });
    },
    getLuntanDetail(commit, u) {
      console.log("u", u);
      let data = {
        href: u
      };
      console.log("getLuntanDetail", data);
      return request({
        url: "http://localhost:3000/luntanDetail",
        data,
        method: "POST"
      })
        .then(res => {
          console.log(res);
          return res;
        })
        .catch(err => {
          throw err;
        });
    }
  },
  modules: {}
});
