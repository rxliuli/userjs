# 百度网盘导出数据

## 说明

> [GitHub](https://github.com/rxliuli/userjs/tree/master/src/PanbaiduExportData), [GreasyFork](https://greasyfork.org/zh-CN/scripts/375701)

导出百度网盘中的所有文件/文件夹的数据，方便进行二级的检索和分析。

如果你的文件非常多，例如吾辈测试过 5T+ 的文件，花费的时间可能会非常久，请耐心等待，不要关闭网页！

## 以后可能追加的功能

- [x] 优化操作时的提示的信息（弹框应该才是最好的）
- [x] 允许使用并发异步请求（目前是单个异步请求循环，主要原因是为了避免被百度认为是机器操作）
- [ ] 添加导出数据过滤选项
- [ ] 添加 TreeSize 面板

## 版本变化

- v1.3.0 默认使用多线程调用，能够更快的获取到全部的数据
- v1.2.0 使用弹窗优化提示，对方法进行了详尽的注释
- v1.1.2 优化提示内容中，1.2.X 版本将使用弹窗替换
- v1.1.1 添加了错误输出，方便排错
- v1.1.0 优化加载时机，导出数据的格式追加 `origin` 属性，精简了代码
- v1.0.0 实现了基本的导出功能

## 数据格式

```js
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
```

示例 json

```json
[
  {
    "path": "/",
    "parent": "",
    "name": "/",
    "size": 24176143563,
    "isdir": 1
  },
  {
    "path": "/apps",
    "parent": "/",
    "name": "apps",
    "size": 0,
    "isdir": 1,
    "orgin": {
      "category": 6,
      "unlist": 0,
      "fs_id": 493355710434815,
      "oper_id": 0,
      "server_ctime": 1489383931,
      "isdir": 1,
      "local_mtime": 1489383931,
      "size": 0,
      "server_filename": "apps",
      "share": 0,
      "path": "/apps",
      "local_ctime": 1489383931,
      "server_mtime": 1489383931
    }
  },
  {
    "path": "/缘",
    "parent": "/",
    "name": "缘",
    "size": 2009906581,
    "isdir": 1,
    "orgin": {
      "category": 6,
      "unlist": 0,
      "fs_id": 738119398587273,
      "oper_id": 911730674,
      "server_ctime": 1545330546,
      "isdir": 1,
      "local_mtime": 1545330546,
      "size": 0,
      "server_filename": "缘",
      "share": 0,
      "path": "/缘",
      "local_ctime": 1545330546,
      "server_mtime": 1545330546
    }
  },
  {
    "path": "/缘/缘.part1.rar",
    "parent": "/缘",
    "name": "缘.part1.rar",
    "size": 734003200,
    "isdir": 0,
    "orgin": {
      "server_mtime": 1545330549,
      "category": 6,
      "unlist": 0,
      "fs_id": 488864683086906,
      "oper_id": 911730674,
      "server_ctime": 1482777417,
      "isdir": 0,
      "local_mtime": 1482777416,
      "size": 734003200,
      "share": 0,
      "md5": "bedac7003a7989a73dc0a0bd182c9efd",
      "path": "/缘/缘.part1.rar",
      "local_ctime": 1482777416,
      "server_filename": "缘.part1.rar"
    }
  },
  {
    "path": "/缘/缘.part2.rar",
    "parent": "/缘",
    "name": "缘.part2.rar",
    "size": 734003200,
    "isdir": 0,
    "orgin": {
      "server_mtime": 1545330549,
      "category": 6,
      "unlist": 0,
      "fs_id": 191568695286416,
      "oper_id": 911730674,
      "server_ctime": 1482778194,
      "isdir": 0,
      "local_mtime": 1482778194,
      "size": 734003200,
      "share": 0,
      "md5": "e61817899476a2b8525b67154142925e",
      "path": "/缘/缘.part2.rar",
      "local_ctime": 1482778194,
      "server_filename": "缘.part2.rar"
    }
  },
  {
    "path": "/缘/缘.part3.rar",
    "parent": "/缘",
    "name": "缘.part3.rar",
    "size": 541900181,
    "isdir": 0,
    "orgin": {
      "server_mtime": 1545330549,
      "category": 6,
      "unlist": 0,
      "fs_id": 933042145007680,
      "oper_id": 911730674,
      "server_ctime": 1482778767,
      "isdir": 0,
      "local_mtime": 1482778767,
      "size": 541900181,
      "share": 0,
      "md5": "c767fc1b2cd8bd9ebf91a7d2c9797467",
      "path": "/缘/缘.part3.rar",
      "local_ctime": 1482778767,
      "server_filename": "缘.part3.rar"
    }
  },
  {
    "path": "/资源",
    "parent": "/",
    "name": "资源",
    "size": 0,
    "isdir": 1,
    "orgin": {
      "category": 6,
      "unlist": 0,
      "fs_id": 309035487801360,
      "oper_id": 911730674,
      "server_ctime": 1545229969,
      "isdir": 1,
      "local_mtime": 1545229969,
      "size": 0,
      "server_filename": "资源",
      "share": 0,
      "path": "/资源",
      "local_ctime": 1545229969,
      "server_mtime": 1545229969
    }
  }
]
```
