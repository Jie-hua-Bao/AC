// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

// require express-handlebars heres
const exphbs = require('express-handlebars')

// setting template engine
app.engine('handlebars',exphbs({defaultLayout:'main'}))
app.set('view engine','handlebars')

// setting static files
app.use(express.static('public'))

//路由設定
app.get('/',(req,res)=>{
  res.render('index')
})

app.get('/:title',(req,res)=>{
  const title = req.params.title
  res.render('show',{title:title})
})

// app.get('/about',(req,res)=>{
//   res.render('about')
// })
// app.get('/portfolio', (req, res) => {
//   res.render('portfolio');
// });
// app.get('/contact',(req,res)=>{
//   res.render('contact')
// })
// 啟動伺服器
app.listen(port,()=>{
  console.log(`Express is listeing on localhost:${port} `)
})