const charset = require('superagent-charset')
const request = require('superagent')
const agent = requset.agent()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36'
}
let url = '';
// 通过该网址和指定字符编码来爬取文章
agent.get(url)
    .charset(charset)
    .timeout(20000)
    .catch(err => {
        if (err.status === 301) {
            headers.Cookie = err.response.headers['set-cookie'].toString()
            return agent.get(url).set(headers)
                .charset(charset)
                .timeout(20000)
        }
        return Promise.reject(err)
    })
