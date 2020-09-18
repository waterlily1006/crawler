<template>
    <div class="news">
        <ul class="news_tab">
            <li
                    v-for="item in newsType"
                    :key="item.key"
                    :class="{ active: item.key === activekey }"
                    @click="chooseNews(item.key)"
            >
                {{ item.name }}
                <span class="s-menu-item-underline"></span>
            </li>
        </ul>
        <div class="news_list_block">
            <ul v-show="activekey === 'rmlt'">
                <li class="news_li" v-for="(item, index) in rmList" :key="index">
                    <a target="_blank" :href="'/detail?origin=luntan&url=' + item.href">
                        {{ item.title }}{{ item.href }}</a
                    >
                </li>
            </ul>
            <ul v-show="activekey === 'netease'">
                <li class="news_li" v-for="(item, index) in neteaseList" :key="index">
                    <a
                            target="_blank"
                            :href="'/detail?origin=netease&url=' + item.href.split('com/')[1]"
                    >
                        {{ item.title }}{{ item.href }}</a
                    >
                </li>
            </ul>
            <ul v-show="activekey === 'tencent'">
                <li class="news_li" v-for="(item, index) in tencentList" :key="index">
                    <a
                            target="_blank"
                            :href="'/detail?origin=tencent&url=' + item.href.split('com/')[1]"
                    >
                        {{ item.title }}{{ item.href }}</a
                    >
                </li>
            </ul>
            <ul v-show="activekey === 'cctv'">
                <li class="news_li" v-for="(item, index) in cctvList" :key="index">
                    <a
                            target="_blank"
                            :href="'/detail?origin=cctv&url=' + item.url.split('com/')[1]"
                    >
                        {{ item.title }}{{ item.url }}</a
                    >
                </li>
                <li>
                    <div class="loading_box">
                        <div class="loading" ref="loading"></div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "NewsList",
        data() {
            return {
                timer: null,
                rmList: [],
                neteaseList: [],
                tencentList: [],
                cctvList: [],
                activekey: "netease",
                newsType: [
                    {
                        name: "网易新闻",
                        key: "netease"
                    },
                    {
                        name: "CCTV",
                        key: "cctv"
                    },
                    {
                        name: "腾讯新闻",
                        key: "tencent"
                    },
                    {
                        name: "人民论坛网",
                        key: "rmlt"
                    }
                ]
            };
        },
        methods: {
            ...mapActions([
                "getrmltList",
                "getNeteaseList",
                "getTencentList",
                "getcctvList"
            ]),
            chooseNews(key) {
                this.activekey = key;
                switch (key) {
                    case "netease":
                        this.getNeteaseList().then(res => {
                            this.neteaseList = res;
                        });
                        break;
                    case "cctv":
                        this.stopLoading();
                        this.loading();
                        this.getcctvList().then(res => {
                            this.stopLoading();
                            this.cctvList = res;
                        });
                        break;
                    case "tencent":
                        this.getTencentList().then(res => {
                            this.tencentList = res;
                        });
                        break;
                    case "rmlt":
                        this.getrmltList().then(res => {
                            this.rmList = res;
                        });
                        break;
                }
            },
            loading() {
                let deg = 0;
                let that = this;
                this.timer = setInterval(() => {
                    deg = deg + 1;
                    that.$refs.loading.style.transform = "rotate(" + deg + "deg)";
                }, 10);
            },
            stopLoading() {
                console.log('stop')
                this.timer = null;
            }
        },
        props: {
            msg: String
        },
        created() {
            this.getNeteaseList().then(res => {
                this.neteaseList = res;
            });
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .news {
        width: 80%;
        min-height: 75vh;
        background: rgba(255, 255, 255, 0.6);
        margin: 130px auto;
        border-radius: 10px;
        padding: 30px;

        .loading_box {
            background-position: -64px 0;
        }

        .loading {
            width: 64px;
            height: 64px;
            margin: 50px auto 0 auto;
            background: url(https://faviconer.net/img/home-loaders.svg) -64px 0 no-repeat transparent;
        }

        .news_tab {
            display: flex;
            font-size: 18px;

            li {
                display: inline-block;
                cursor: pointer;
                margin-right: 24px;
                margin-top: 4px;
                line-height: 26px;
                position: relative;

                &.active {
                    color: #000;

                    .s-menu-item-underline {
                        content: "";
                        position: absolute;
                        bottom: -2px;
                        left: 0;
                        height: 2px;
                        width: 100%;
                        background: #4e71f2;
                        border-radius: 4px;
                    }
                }
            }
        }
    }

    .news_list_block {
        margin-top: 30px;

        .news_li {
            height: 48px;
            line-height: 48px;
            font-size: 16px;
            overflow: hidden;
            /*border-bottom: 1px solid #ddd;*/
            a {
                color: #666;
                text-decoration: none;

                &:hover {
                    color: #4e71f2;
                }
            }

            &:hover {
                color: #4e71f2;
            }
        }
    }
</style>
