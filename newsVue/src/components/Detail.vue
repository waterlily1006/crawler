<template>
  <div class="cont-detail">
    <div class="layer">
      <div class="news">
        <h3 v-html="detail.title"></h3>
        <p class="time" v-html="detail.time"></p>
        <div v-html="detail.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Detail.vue",
  data() {
    return {
      detail: {}
    };
  },
  methods: {
    ...mapActions([
      "getNeteaseDetail",
      "getTencentDetail",
      "getcctvDetail",
      "getLuntanDetail"
    ])
  },
  mounted() {

  },
  created() {
    let u = window.location.search.split("url=")[1];
    console.log("created__u", u);
    let type = window.location.search;
    console.log(u, type);
    if (type.indexOf("luntan") >= 0) {
      this.getLuntanDetail(u).then(res => {
        this.detail = res;
      });
    }
    if (type.indexOf("netease") >= 0) {
      this.getNeteaseDetail(u).then(res => {
        this.detail = res;
      });
    }
    if (type.indexOf("tencent") >= 0) {
      this.getTencentDetail(u).then(res => {
        this.detail = res;
      });
    }
    if (type.indexOf("cctv") >= 0) {
      this.getcctvDetail(u).then(res => {
        this.detail = res;
      });
    }
  }
};
</script>

<style lang="scss">


* {
  margin: 0;
  padding: 0;
}

ol,
li {
  list-style: none;
}

.cont-detail {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-image: url("~@/assets/news_bg.jpg");
  background-attachment: fixed;
  background-size: cover;
  width: 100%;
  opacity: 1;
  padding: 0;
  min-height: 100vh;
}

.layer {
  width: 100%;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.news {
  width: 60%;
  max-width: 1300px;
  min-height: 75vh;
  background: rgba(255, 255, 255, 0.6);
  margin: 130px auto;
  border-radius: 10px;
  padding: 30px;

  a {
    color: #4e71f2;
  }

  h3 {
    text-align: center;
    font-size: 20px;
  }

  .time {
    text-align: center;
    margin: 10px;
  }

  img {
    margin: 16px auto !important;
    display: block;
    max-width: 100%;
  }
  p{
    margin-top: 10px;
  }
}
</style>
