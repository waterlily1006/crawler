import "whatwg-fetch";
import qs from "qs";
import fetchJsonp from "fetch-jsonp";

const request = ({ method = "GET", url, data = null, type }) => {
  let options = {
      method
    },
    params = qs.stringify(data);

  if (method === "GET" && params && params.length) {
    url = url.indexOf("?") > -1 ? url + "&" + params : url + "?" + params;
  }
  if (method == "POST" && data) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers = new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      });
      options.body = params;
    }
  }
  if (type === "jsonp") {
    return fetchJsonp(url, { timeout: 15000 }).then(res => {
      return res.json();
    });
  } else {
    return window.fetch(url, options).then(res => {
      return res.text().then(text => {
        let tmp = JSON.parse(text);
        if (!res.ok) {
          throw {
            statusText: res.statusText,
            ok: res.ok,
            code: tmp.error_code,
            msg: tmp.msg,
            status: res.status
          };
        }
        return tmp;
      });
    });
  }
};

export default request;
