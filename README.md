# 问卷管理系统

> Questionnaire Management System

* vue实现路由拦截
    * `vue-router`中添加`meta`参数元信息，在`beforeEach`判断路径和权限，使用`addRoutes`动态添加路由
    * `axios`的http拦截
    * 跨域cookie需要身份认证withCredentials，后台设置withCredentials，但此时不能使用`Access-Control-Allow-Origin: *`

* 关于vue组件
    * 用`render`函数渲染出来的是子组件
    * `<component>`可当做元组件（动态组件），使用is参数动态加载需要的组件

* 关于express
    * 默认格式ipv6，可设置`server.listen(port, '0.0.0.0')`
    * `cookie-session`中间件将session保存到cookie中

* 过滤粘贴文本
    * 监听`paste`事件
    * 从`clipboardData`对象中获取剪切板的内容
    * `document.execCommand("insertText")`插入内容
    * [参考文章](http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/)

* 利用 webpack 给生产环境和发布环境配置不同的接口地址，就可以在js中读取process.env.BASE_URL (不知为啥里面还有双引号)
```
new webpack.DefinePlugin({
  'process.env': require('../config/dev.env'),
  'BASE_URL': '"http://localhost:8080"'
})
```
* `webpack 3`自带`uglifyjs`出现问题，手动安装

* 在entry中添加vendors，提取公共依赖，切换页面时可以从缓存读取

* 使用`selection`和`range`操作文本选中区域和光标
