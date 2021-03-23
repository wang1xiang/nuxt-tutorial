const express = require('express')
const fs = require('fs')
const template = require('art-template')
const app = express()
app.get('/', (req, res) => {
  // 1. 得到模板内容
  const templateStr = fs.readFileSync('./index.html', 'utf-8')
  // 2. 得到数据
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))
  // 3. 渲染：数据 + 模板 = 完整结果
  const html = template.render(templateStr, data)
  // 4. 把渲染结果发送给客户端
  res.send(html)
})
app.listen(3000, () => console.log('running...'))