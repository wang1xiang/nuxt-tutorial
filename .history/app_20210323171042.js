// 搜索引擎怎么获取网页
const http = require('http')

http.get('http://localhost:3000', res => {
  let data = ''
  res.on(data, chunk => {
    data += chunk
  })
  res.on('end', () => {
    console.log(data)
  })
})