<template>
  <div class="home">
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var ajax = {
        x: function() {
          if (typeof XMLHttpRequest !== "undefined") {
            return new XMLHttpRequest();
          }
          var versions = [
            "MSXML2.XmlHttp.6.0",
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
          ];
          var xhr;
          for (var i = 0; i < versions.length; i++) {
            try {
              xhr = new ActiveXObject(versions[i]);
              break;
            } catch (e) {}
          }
          return xhr;
        },
        send: function(url, callback, method, data, async) {
          if (async === undefined) {
            async = true;
          }
          var x = this.x();
          x.open(method, url, async);
          x.onreadystatechange = function() {
            if (x.readyState == 4) {
              callback(x.responseText);
            }
          };
          if (method == "POST") {
            x.setRequestHeader(
              "Content-type",
              "application/x-www-form-urlencoded"
            );
          }
          x.send(data);
        },
        get: function(url, data, callback, async) {
          var query = [];
          for (var key in data) {
            query.push(
              encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
            );
          }
          this.send(
            url + (query.length ? "?" + query.join("&") : ""),
            callback,
            "GET",
            null,
            async
          );
        },
        post: function(url, data, callback, async) {
          var query = [];
          for (var key in data) {
            query.push(
              encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
            );
          }
          this.send(url, callback, "POST", query.join("&"), async);
        },
        jsonp: function(url) {
          url = url + "?callback=my_callback_method";
          var script = document.createElement("script");
          script.src = url;
          document.getElementsByTagName("head")[0].appendChild(script);
        }
      };

      var TEST_URL = "eshinetest.cn";
      var BTS_URL = "dangtang8.net";
      var SERVER_DEMAIN = TEST_URL;
      var SERVER_DEMAIN_OLD = "downtown8.cn";

      var KUZZEL_URL = "kuzzle." + SERVER_DEMAIN;
      var BOS_API = "http://cloudstoreapi." + SERVER_DEMAIN + ":10100/sapi";
      //var ORDERS_API = "http://127.0.0.1:10300/api";
      //var ORDERS_API = "http://joe.box.eshine.cn/api";
      var ORDERS_API = "http://ecloudorders." + SERVER_DEMAIN + ":10300/api";
      var WECHAT_API = "http://wp." + SERVER_DEMAIN + "/api";
      var WECHAT_WPT = "wp." + SERVER_DEMAIN + "";

      var JIAOHAOPING_API = "http://redisproxy." + SERVER_DEMAIN + "";

      var REDISPROXY_URL = "http://redisproxy." + SERVER_DEMAIN + "";

      var ES_BOS_INDEX = "ebossh";

      var ESPROXY_URL = "http://esproxy." + SERVER_DEMAIN + "";

      var ORDER_PREVIEW_URL =
        "http://morderpreview." + SERVER_DEMAIN + "/proxy/wxqrimg/";

      var SSOAPI_URL = "http://ssoapi." + SERVER_DEMAIN + ":10403/api";

      function getParameterByName(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }

      function base64Decode(input) {
        rv = window.atob(input);
        rv = escape(rv);
        rv = decodeURIComponent(rv);
        return rv;
      }

      var mainflag = true;
      var brandId = getParameterByName("brandId");
      var gradeId = getParameterByName("gradeId");
      if (brandId) {
        var wxflag = !!~navigator.userAgent.indexOf("MicroMessenger"),
          valid,
          hash = location.hash,
          token = getParameterByName("token");
        hash && (hash = hash.substr(2));
        hash && hash.indexOf("P") === 0 && (hash = hash.substr(2));
        if (!token) {
          var localKey = "DTB_" + brandId;
          var localTokenInfo = localStorage.getItem(localKey);
          //localTokenInfo = JSON.stringify({ token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6MjA1MDAzNywiYnJhbmRJZCI6IjEwMDAwMSIsIm9wZW5JZCI6Im94WG9yeENCMkNKMnlaYUJZMUtMMmRfUmhEVlUiLCJpYXQiOjE0OTUxODM3NDgsImV4cCI6MTQ5NTc4ODU0OH0.WQCpJ9K_KIy5miL-uMx2F4kI6eG6tZrqrvTQCU1-aA3ybPJctiMIVCSxFs2idlhmtmu_lnu4xcos4a1_XmGyKTzB_x9ZEZAop-ZcfNtN3x_YlnO72yefWng85ZunewBpeJJVJk4UJaijcwUGAXeA2anYLyF5zaWCfvwJbS7AOdY" });

          if (localTokenInfo) {
            localTokenInfo = JSON.parse(localTokenInfo);
            var tokencontent = localTokenInfo && localTokenInfo.token;
            if (tokencontent) {
              var parts = tokencontent.split(".");
              var content = parts.length > 0 && parts[1];
              var jwttoken = base64Decode(content);
              jwttoken && (jwttoken = JSON.parse(jwttoken));
              var exp = ((jwttoken && jwttoken.exp) || 0) * 1000;
              valid = exp && exp > Date.now() + 30 * 60 * 1000;
              !wxflag && (valid = valid && jwttoken.v == 2);
              valid = valid && (!wxflag || !!jwttoken.openId);
              !valid && localStorage.removeItem(localKey);

              if (valid) {
                mainflag = false;
                function handlemain(payinfo) {
                  payinfo.code && (payinfo.wxpay_changed = 1);
                  if (payinfo.wxpay_changed) {
                    var iat = ((jwttoken && jwttoken.iat) || 0) * 1000;
                    valid = iat && iat >= payinfo.wxpay_changed;
                    valid && (token = tokencontent);
                  }
                  !valid && localStorage.removeItem(localKey);
                  mainprocess();
                }
                var payinforeturnflag = false;
                ajax.get(
                  REDISPROXY_URL + "/payinfo?key=" + brandId,
                  {},
                  function(response) {
                    payinforeturnflag = true;
                    var obj = { wxpay_changed: 2 };
                    if (response && response.indexOf("{") === 0) {
                      try {
                        obj = JSON.parse(response);
                      } catch (e) {
                        console.log(e);
                      }
                    }
                    handlemain(obj);
                  }
                );
                window.setTimeout(function() {
                  if (!payinforeturnflag) {
                    handlemain({ wxpay_changed: 1 });
                  }
                }, 300);
              }
            }
          }
        }
      }
      if (mainflag) {
        mainprocess();
      }
      function mainprocess() {
        console.log(valid);
        window._wpt = {
          callback: function() {
            location.replace(
              "jump?token=" +
                token +
                "&st=" +
                Date.now() +
                "&gradeId=" +
                gradeId +
                "&r=true&brandId=" +
                brandId +
                "#/P/" +
                hash
            );
          }
        };
        if (valid) {
          _wpt.callback();
        } else {
          var wps = document.createElement("script");
          // wps.src = "//" + window.WECHAT_WPT + "/P/check.js?ts=" + Date.now();
          wps.src = "//" + WECHAT_WPT + "/P/check.js?ts=" + Date.now();
          console.log(1);
          document.body.appendChild(wps);
        }
      }
    }
  }
};
</script>
