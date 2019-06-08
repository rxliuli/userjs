// ==UserScript==
// @name         百度网盘导出数据
// @namespace    http://github.com/rxliuli/
// @version      1.3.0
// @description  导出百度网盘中的所有文件/文件夹的数据，方便进行二级的检索和分析
// @author       rxliuli
// @match        https://pan.baidu.com/disk/home*
// @license      MIT
// @note         v1.3.0 默认使用多线程调用，能够更快的获取到全部的数据
// @note         v1.2.0 使用弹窗优化提示，对方法进行了详尽的注释
// @note         v1.1.2 优化提示内容中，1.2.X 版本将使用弹窗替换
// @note         v1.1.1 添加了错误输出，方便排错
// @note         v1.1.0 优化加载时机，导出数据的格式追加 `origin` 属性，精简了代码
// @note         v1.0.0 实现了基本的导出功能
// ==/UserScript==

;(function(dialog) {
  'use strict'

  /**
   * 根据 html 字符串创建 Element 元素
   * @param {String} str html 字符串
   * @returns {Element} 创建的 Element 元素
   */
  function createElByString(str) {
    var root = document.createElement('div')
    root.innerHTML = str
    return root.querySelector('*')
  }

  /**
   * 直接删除指定元素
   * @param {Element} el 需要删除的元素
   */
  function removeEl(el) {
    var parent = el.parentElement
    parent.removeChild(el)
  }

  /**
   * 显示一个加载框
   * 包含标题和内容两部分，内容时刻变化着
   * @param {String} title 标题内容
   * @returns {Object} 包含了 {@link return.setTitle/return.setContent/return.close} 三个方法的对象
   */
  function showLoading(title) {
    var $loadingDialog = createElByString(
      `
      <div style="
            width: 500px;
            position: fixed;
            right: 50px;
            bottom: 50px;
            z-index: 100;
            background-color: aqua;
            padding: 10px;
            border-radius: 10px;
        ">
        <header style="
            font-size: 30px;
            font-weight: bolder;
            border-bottom: white;
            border-bottom-width: 1px;
        ">请求数据中，请耐心等待。。。</header>
        <section style="
              font-size: 16px;
          ">正在读取文件夹 /</section>
      </div>
      `,
    )
    var $title = $loadingDialog.querySelector('header')
    var $content = $loadingDialog.querySelector('section')
    $title.innerHTML = title
    document.body.append($loadingDialog)
    return {
      setTitle(title) {
        $title.innerHTML = title
      },
      setContent(content) {
        $content.innerHTML = content
      },
      close() {
        removeEl($loadingDialog)
      },
    }
  }

  /**
   * 轮询等待指定资源加载完毕再执行操作
   * 使用 Promises 实现，可以使用 ES7 的 {@async}/{@await} 调用
   * @param {Function} resourceFn 判断必须的资源是否存在的方法
   * @param {Object} options 选项
   * @returns Promise 对象
   */
  function waitResource(resourceFn, options) {
    var optionsRes = Object.assign(
      {
        interval: 1000,
        max: 10,
      },
      options,
    )
    var current = 0
    return new Promise((resolve, reject) => {
      var timer = setInterval(() => {
        if (resourceFn()) {
          clearInterval(timer)
          resolve()
        }
        current++
        if (current >= optionsRes.max) {
          clearInterval(timer)
          reject('等待超时')
        }
      }, optionsRes.interval)
    })
  }

  /**
   * 等待指定的时间/等待指定表达式成立
   * @param {Number|Function} param 等待时间/等待条件
   * @returns {Promise} Promise 对象
   */
  function wait(param) {
    return new Promise(resolve => {
      if (typeof param === 'number') {
        setTimeout(resolve, param)
      } else if (typeof param === 'function') {
        var timer = setInterval(() => {
          if (param()) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      } else {
        resolve()
      }
    })
  }

  /**
   * 将数组异步压平一层
   * @param {Array} arr 数组
   * @param {Function} fn 映射方法
   */
  async function asyncFlatMap(arr, fn) {
    var res = []
    for (const i in arr) {
      res.push(...(await fn(arr[i])))
    }
    return res
  }

  /**
   * 文件数据信息类
   */
  class File {
    /**
     * 构造函数
     * @param {String} path 全路径
     * @param {String} parent 父级路径
     * @param {String} name 文件名
     * @param {String} size 大小(b)
     * @param {String} isdir 是否为文件
     * @param {String} {origin} 百度云文件信息的源对象
     */
    constructor(path, parent, name, size, isdir, origin) {
      this.path = path
      this.parent = parent
      this.name = name
      this.size = size
      this.isdir = isdir
      this.orgin = origin
    }
  }

  /**
   * 获取指定文件夹下的一级文件/文件夹列表
   * @param {String} path 绝对路径
   * @returns {Promise} 文件/文件夹列表
   */
  async function getDir(path) {
    var baseUrl = 'https://pan.baidu.com/api/list?'
    try {
      dialog.setContent(`正在读取文件夹：${path}`)
      var res = await fetch(`${baseUrl}dir=${encodeURIComponent(path)}`)
      var json = await res.json()
      return json.list
    } catch (err) {
      console.log(`读取文件夹 ${path} 发生了错误：`, err)
      return []
    }
  }
  /**
   * 获取根文件夹信息
   * @param {String} path 文件夹路径
   * @returns {File} 根文件夹信息
   */
  function currentDir(path) {
    var lastIndex = path.lastIndexOf('/')
    return lastIndex <= 0 && !path.substr(lastIndex + 1)
      ? new File('/', '', '/', 0, 1)
      : new File(
          path,
          path.substr(0, lastIndex) || '/',
          path.substr(lastIndex + 1),
          0,
          1,
        )
  }

  /**
   * 递归获取所有文件/文件夹
   * 测试获取 34228 条数据
   * - 100 线程：156518ms
   * - 5   线程：220500ms
   * - 1   线程：超过 20min
   * 实现：
   * 1. 请求文件夹下的所有文件/文件夹
   * 2. 如果是文件则直接添加到结果数组中
   * 3. 如果是文件夹则递归调用当前方法
   * @param {String} [path] 指定根文件夹
   */
  async function asyncList(path = '/') {
    return new Promise(resolve => {
      var count = 1
      dialog = showLoading(`请求数据中，已经发现了 ${count} 个文件`)
      var queueCount = 0
      var waitQueueCount = 0

      // 结果数组
      var result = []
      async function children(path) {
        var now = Date.now()
        waitQueueCount++
        await wait(() => queueCount < 5)
        console.log(`等待时长：${Date.now() - now}，当前总数：${count}`)
        waitQueueCount--
        queueCount++
        getDir(path).then(fileList => {
          fileList.forEach(file => {
            dialog.setTitle(`请求数据中，已经发现了 ${++count} 个文件`)
            var res = new File(
              file.path,
              path,
              file.server_filename,
              file.size,
              file.isdir,
              file,
            )
            result.push(res)
            if (res.isdir === 1) {
              children(res.path)
            }
          })
          if (--queueCount === 0 && waitQueueCount === 0) {
            dialog.close()
            resolve(result)
          }
        })
      }
      children(path)
    })
  }

  /**
   * 递归获取指定路径下的文件/文件夹列表
   * 该方法使用单线程获取数据，所以速度较慢，但被 ban 的概率较低，比较稳定
   * @param {String} [path] 路径
   * @returns {Array} 文件/文件夹列表
   */
  async function syncList(path = '/') {
    var count = 1
    dialog = showLoading(`请求数据中，已经发现了 ${count} 个文件`)

    /**
     * 递归获取到所有的子级文件/文件夹
     * @param {String} path 指定获取的文件夹路径
     * @returns {Array} 指定文件夹下所有的文件/文件夹列表
     */
    async function children(path) {
      var fileList = await getDir(path)
      return asyncFlatMap(fileList, async file => {
        dialog.setTitle(`请求数据中，已经发现了 ${++count} 个文件`)
        var res = new File(
          file.path,
          path,
          file.server_filename,
          file.size,
          file.isdir,
          file,
        )
        if (res.isdir !== 1) {
          return [res]
        }
        return [res].concat(await children(res.path))
      })
    }

    var result = [currentDir(path)].concat(await children(path))
    dialog.close()
    return result
  }

  /**
   * 统计所有文件夹的大小
   * @param {Array} files 文件/文件夹对象列表
   * @returns 所有已经统计大小完成的文件/文件夹列表
   */
  function countTreesize(files) {
    var dialog = showLoading('正在统计文件夹大小，请耐心等待。。。')
    // 按照 parent 分组
    var fileMap = files.reduce((res, file) => {
      if (!res[file.parent]) {
        res[file.parent] = []
      }
      res[file.parent].push(file)
      return res
    }, {})

    /**
     * 计算文件夹大小
     * @param {File} dir 文件夹对象
     * @returns {Number} 文件大小，以 b 为单位
     */
    function castDirSize(dir) {
      var temp = fileMap[dir.path]
      return !temp
        ? dir.size
        : temp
            .map(file => {
              if (file.isdir !== 1) {
                return file.size
              } else {
                return castDirSize(file)
              }
            })
            .reduce((a, b) => a + b)
    }

    var result = files.map(file => {
      file.size = castDirSize(file)
      return file
    })
    dialog.close()
    return result
  }

  /**
   * 将对象转换为 json 并下载
   * @param {Object} obj 要下载的对象数据
   * @param {String} name 文件名
   */
  function downloadJson(obj, name = 'unknown.json') {
    var blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: 'application/json',
    })
    // 字符内容转变成blob地址
    // 创建隐藏的可下载链接
    var eleLink = createElByString(`
      <a
        href="${URL.createObjectURL(blob)}"
        download="${name}"
        style="
            display: none;
        "
      />
    `)
    // 触发点击
    document.body.appendChild(eleLink)
    eleLink.click()
    // 然后移除
    removeEl(eleLink)
  }

  /**
   * 下载百度网盘的数据
   */
  async function download(path) {
    const now = Date.now()
    var files = await asyncList(path)
    var countFiles = countTreesize(files)
    downloadJson(countFiles, 'dataset.json')
    console.log(`本次导出数据花费时间：${Date.now() - now}`)
  }

  // 追加 [导出数据] 按钮到 [新建文件夹] 后面
  function addExportDataBtn() {
    var exportBtn = createElByString(`
    <a id="exportDataId" class="g-button" title="导出数据" href="#">
      <span class="g-button-right">
        <span class="text">导出数据</span>
      </span>
    </a>
    `)
    var mkdirBtn = document.querySelector('div.tcuLAu > a:nth-child(3)')
    mkdirBtn.after(exportBtn)
    document
      .querySelector('#exportDataId')
      .addEventListener('click', function() {
        console.log('点击了导出数据，准备下载中。。。')
        download('/')
      })

    console.log(
      '%c 百度网盘导出数据脚本加载成功！！！',
      'background:#aaa;color:#bada55; font-size: 30px;',
    )
  }

  /**
   * 初始化，等待【新建文件夹】按钮加载完毕再添加按钮
   */
  async function init() {
    // 必须等待按钮加载完毕
    await waitResource(
      () => document.querySelector('div.tcuLAu > a:nth-child(3)'),
      {
        interval: 1000,
        max: 100,
      },
    )
    addExportDataBtn()
  }

  init()
})()
