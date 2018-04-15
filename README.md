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

* 利用 webpack 给生产环境和发布环境配置不同的接口地址，就可以在js中读取process.env.BASE_URL
```
new webpack.DefinePlugin({
  'process.env': require('../config/dev.env'),
  'BASE_URL': '"http://localhost:8080"'
})
```
变量中有2个引号，官方解释如下
> - 如果这个值是一个字符串，它会被当作一个代码片段来使用。
- 如果这个值不是字符串，它会被转化为字符串(包括函数)。
- 如果这个值是一个对象，它所有的 key 会被同样的方式定义。
- 如果在一个 key 前面加了 typeof,它会被定义为 typeof 调用。
* `webpack 3`自带`uglifyjs`出现问题，通过手动安装解决

* `webpack`中使用`alias`，可以在`alias`前加上`~`符号，视作依赖。比如用于`background: url('~@/assets/logo.png')`

* 在entry中添加vendors，提取公共依赖，切换页面时可以从缓存读取

* 使用`selection`和`range`操作文本选中区域和光标

* reset.css将表格设为`border-collapse: collaspe;`，导致element-ui的表格出现横向滚动条，设置为`border-collapse: separate;`可解决

* 使用`js-xlxs`插件实现前端导出excel功能，基本步骤：
    1. 生成一定格式的json，然后使用`json_to_sheet`方法
    ```
    const workbook = {
      SheetNames: ['Sheet1'],
      Sheets: {},
      Props: {}
    };
    // 通过json_to_sheet转成单页(Sheet)数据
    workbook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet([
      { A:"S", B:"h", C:"e", D:"e", E:"t", F:"J", G:"S" },
      { A: 1,  B: 2,  C: 3,  D: 4,  E: 5,  F: 6,  G: 7  },
      { A: 2,  B: 3,  C: 4,  D: 5,  E: 6,  F: 7,  G: 8  }
    ], {header:["A","B","C","D","E","F","G"]});
    ```

    2. 转换成Blob
    ```
    let s2ab = (s) => {
      // 字符串转字符流
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    };
    let blob = new Blob([
      s2ab(
        XLSX.write(workbook, {
          bookType: 'xlsx',
          bookSST: false,
          type: 'binary'
        })
      )
    ], {
      type: "application/octet-stream"
    });
    ```

    3. 利用a标签的download属性和`URL.createObjectURL()`方法下载文件[可参考里面步骤3](https://blog.csdn.net/abczdefg/article/details/79769050)
    ```
    saveFile(blob, filename) {
      let link = document.createElement('a');
      link.download = filename || `download.xlsx`;
      link.href = URL.createObjectURL(blob); //绑定a标签
      document.body.appendChild(link);
      link.click(); //模拟点击实现下载
      setTimeout(() => {
        //延时释放
        URL.revokeObjectURL(blob); //用URL.revokeObjectURL()来释放这个object URL
        document.body.removeChild(link);
      }, 100);
    }
    ```

* 使用`devServer`中的`proxy`可以实现dev中跨域，此时请求路径以`/`开头
