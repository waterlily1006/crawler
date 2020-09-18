const express = require('express');// 声明express模块
const https = require('https')
const http = require('http')
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next();
});
const superagent = require('superagent');
var charset = require("superagent-charset");
charset(superagent); //设置字符
const cheerio = require('cheerio');
// ...

let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    //console.log('Your App is running at http://%s:%s', host, port);

});

let baidu = 'http://www.rmlt.com.cn/'
let netease = 'https://news.163.com/domestic/'//国内即时新闻
let tencent = 'https://news.qq.com/ninja/qqnews_jinrihuati.htm'//今日话题
let touTiao = 'https://www.toutiao.com/api/pc/realtime_news/'//24小时实时新闻
let cctv = 'http://news.cctv.com/2019/07/gaiban/cmsdatainterface/page/news_1.jsonp?cb=t&cb=news'

//论坛网新闻
app.get('/', function (req, res) {
    superagent.get(baidu).end((err, data) => {
        if (err) {
            // 如果访问失败或者出错，会这行这里
            console.log(`热点新闻抓取失败 - ${err}`)
        } else {
            // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
            // 抓取热点新闻数据
            baiduHotNews = getBaiduHotNews(data)
            res.send(baiduHotNews);
        }
    });
});
app.get('/rmltlist', function (req, res) {
    superagent.get(baidu).end((err, data) => {
        if (err) {
            // 如果访问失败或者出错，会这行这里
            console.log(`热点新闻抓取失败 - ${err}`)
        } else {
            // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
            // 抓取热点新闻数据
            baiduHotNews = getBaiduHotNews(data)
            res.send(baiduHotNews);
        }
    });
});
let getBaiduHotNews = (res) => {
    let baiduHotNews = [];
    let $ = cheerio.load(res.text);
    // 找到目标数据所在的页面元素，获取数据
    $('div.today-news ul li a').each((idx, ele) => {
        let news = {
            title: $(ele).text(),        // 获取新闻标题
            href: $(ele).attr('href')    // 获取新闻网页链接
        };
        baiduHotNews.push(news)              // 存入最终结果数组
    });
    return baiduHotNews
};

var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper')
app.post('/luntanDetail', function (req, result) {
    let obj = JSON.parse(JSON.stringify(req.body)), url = obj.href;
    http.get(url, (res) => {
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
        let rawData = ''
        var bufferHelper = new BufferHelper();
        res.on('data', (chunk) => {
            bufferHelper.concat(chunk);
        })
        // 数据流传输完毕
        res.on('end', () => {
            // 将请求的数据保存到本地
            console.log('论坛数据传输完毕')
            let dataStr = iconv.decode(bufferHelper.toBuffer(), "utf-8");
            //通过cheerio 分析
            let $ = cheerio.load(dataStr)// 将请求的网页数据进行转化
            let news = {
                title: $('.article-main h1').html() || $('.diy-title').html(),        // 获取新闻标题
                time: $('.article-main  .article-infos').html(),  // 获取新闻网页链接
                content: $('.article-main .article-content').html() || $('.diy-content-picture').html()
            };
            result.send(news);
        })

    }).on('error', (err) => {
        console.log('请求错误')
    })
});

//网易新闻
app.get('/neteaselist', function (req, res) {
    console.log("neteaselist")
    superagent.get(netease).charset('gbk').end((err, data) => {
        if (err) {
            console.log(`热点新闻抓取失败 - ${err}`)
        } else {
            let neteasehotNews = [];
            let $ = cheerio.load(data.text);
            // 找到目标数据所在的页面元素，获取数据
            $('div.mod_jsxw ul li a').each((idx, ele) => {
                let news = {
                    title: $(ele).text(),        // 获取新闻标题
                    href: $(ele).attr('href')    // 获取新闻网页链接
                };
                neteasehotNews.push(news)              // 存入最终结果数组
            });
            res.send(neteasehotNews);
        }
    });
});
app.post('/neteaseDetail', function (req, result) {
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
        let rawData = ''
        var bufferHelper = new BufferHelper();
        res.on('data', (chunk) => {
            bufferHelper.concat(chunk);
        })
        // 数据流传输完毕
        res.on('end', () => {
            // 将请求的数据保存到本地
            console.log('数据传输完毕')
            let dataStr = iconv.decode(bufferHelper.toBuffer(), "GBK");
            //通过cheerio 分析
            let $ = cheerio.load(dataStr)// 将请求的网页数据进行转化
            let news = {
                title: $('#epContentLeft h1').html(),        // 获取新闻标题
                time: $('#epContentLeft  .post_time_source').html(),  // 获取新闻网页链接
                content: $('#epContentLeft .post_text').html()
            };
            result.send(news);
        })

    }).on('error', (err) => {
        console.log('请求错误')
    })
});


//腾讯今日话题
app.get('/tencentlist', function (req, res) {
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
app.post('/tencentDetail', function (req, result) {
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


//cctv
var request = require('request');
let touTiaoNews = []
app.get('/cctvlist', function (req, res) {
    console.log('cctvlist')
    request.get({
        url: cctv,
        encoding: null //让body 直接是buffer
    }, function (err, response, body) {
        //返回的body 直接就是buffer 了...
        let buf = iconv.decode(body, 'utf-8');
        let buf2 = buf.substr(5, buf.length - 6)
        JSON.parse(buf2).data.list.forEach(function (s) {
            touTiaoNews.push(s)
        });
    });
    res.send(touTiaoNews);
});
app.post('/cctvDetail', function (req, result) {
    let obj = JSON.parse(JSON.stringify(req.body)), url = obj.href;
    console.log('\'/cctvDetail\'',url)
    http.get(url, (res) => {
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
            console.log('数据传输完毕')
            let dataStr = iconv.decode(bufferHelper.toBuffer(), "utf-8");
            //通过cheerio 分析
            let $ = cheerio.load(dataStr)// 将请求的网页数据进行转化
            let news = {
                title: $('#title_area h1').html() || $('.wrapper h1').html(),        // 获取新闻标题
                time: $('#title_area  .info1').html(),  // 获取新闻网页链接
                content: $('#content_area').html() || $('.wrapper #text_area').html()
            };
            result.send(news);
        })

    }).on('error', (err) => {
        console.log('请求错误')
    })
});