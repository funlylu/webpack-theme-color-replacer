﻿var varyColor = require('./varyColor')
var idMap = {}

module.exports = {
    changeColor: function (options, promiseForIE) { //varyColorFunc: color => colorArray
        var oldColors = options.oldColors, newColors = options.newColors, cssUrl = options.cssUrl;
        var _this = this;
        return getCssText(cssUrl, setCssTo) //#409EFF - 网上下载的element-ui主色

        // var links = [].filter.call(document.querySelectorAll('link'), function (e) {
        //     //根据pages下的所有页面列举css
        //     return /(main|index)\..+\.css/.test(e.href || '')
        // });
        // if (links[0]) {
        //     getCssText(links[0].href, _this.themeColor, setCssTo)
        // }

        function getCssText(url, setCssTo) {
            var Promise = window.Promise || promiseForIE
            var elStyle = idMap[url] && document.getElementById(idMap[url]);
            if (elStyle) {
                oldColors = elStyle.color.split('|')
                setCssTo(elStyle, elStyle.innerText)
                return Promise.resolve()
            }
            else {
                elStyle = document.head.appendChild(document.createElement('style'))
                idMap[url] = 'css_' + (+new Date())
                elStyle.setAttribute('id', idMap[url])
                return new Promise(function (resolve, reject) {
                    _this.getCSSString(url, function (cssText) {
                        setCssTo(elStyle, cssText)
                        resolve()
                    }, reject)
                })
            }
        }

        function setCssTo(elStyle, cssText) {
            cssText = _this.replaceCssText(cssText, oldColors, newColors)
            elStyle.color = newColors.join('|')
            elStyle.innerText = cssText
        }
    },
    replaceCssText: function (cssText, oldColors, newColors) {
        oldColors.forEach(function (color, t) {
            cssText = cssText.replace(new RegExp(color.replace(/,/g, ',\\s*'), 'ig'), newColors[t]) // 255, 255,3
        })
        return cssText
    },
    getCSSString: function (url, resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var cssTx = xhr.responseText.replace(/@font-face{[^}]+}/, '')
                    resolve(cssTx)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.onerror = function (e) {
            reject(e)
        }
        xhr.ontimeout = function (e) {
            reject(e)
        }
        xhr.open('GET', url)
        xhr.send()
    },
}
