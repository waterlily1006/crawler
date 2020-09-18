const express=require('express')
const router=express.Router()
const superagent = require('superagent');
const cheerio = require('cheerio');

let tencent = 'https://news.qq.com/ninja/qqnews_jinrihuati.htm'//今日话题


router.get('/tencentlist', function (req, res) {
    console.log("tencent")
    superagent.get(tencent).charset('gbk').end((err, data) => {
        if (err) {
            console.log(`热点新闻抓取失败 - ${err}`)
        } else {
            let tencentNews = [];
            let $ = cheerio.load(data.text);
            // 找到目标数据所在的页面元素，获取数据
            $('div.bd ul li a').each((idx, ele) => {
                let news = {
                    title: $(ele).text(),        // 获取新闻标题
                    href: $(ele).attr('href')    // 获取新闻网页链接
                };
                tencentNews.push(news)              // 存入最终结果数组
            });
            res.send(tencentNews);
        }
    });
});
router.post('/tencentDetail', function (req, result) {
    let obj = JSON.parse(JSON.stringify(req.body)), url = obj.href;
    https.get(url, (res) => {
        // 安全判断
        const {statusCode} = res;  //状态码
        const contentType = res.headers['content-type']; //文件类型
        let err = null;
        if (statusCode !== 200) {
            err = new Error('请求状态错误')
        } else if (!/^text\/html/.test(contentType)) {
            //格式类型是网页
            err = new Error('请求类型错误')
        }
        // err 为真两个判断出错
        if (err) {
            console.log(err)
            res.resume(); // 重置缓存
            return false
        }
        // 数据分段 只要接受数据就会触发data 事件 chunk 每次接受的数据片段
        var bufferHelper = new BufferHelper();
        res.on('data', (chunk) => {
            bufferHelper.concat(chunk);
        })
        // 数据流传输完毕
        res.on('end', () => {
            // 将请求的数据保存到本地
            console.log('腾讯详情数据传输完毕')
            let dataStr = iconv.decode(bufferHelper.toBuffer(), "utf-8");
            //通过cheerio 分析
            let $ = cheerio.load(dataStr)// 将请求的网页数据进行转化
            let news = {
                title: $('.LEFT h1').html(),        // 获取新闻标题
                time: $('#epContentLeft  .post_time_source').html(),  // 获取新闻网页链接
                content: $('.LEFT .content').html()
            };
            result.send(news);
        })

    }).on('error', (err) => {
        console.log('请求错误')
    })
});

module.exports=router