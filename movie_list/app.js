 //設定express模板，存在express的變數中
const express =require ('express')
//啟動express並存放app變數中
const app = express() 
// 預設連接埠號
const port = 3000 
//設定express-handlebars，存在 exphbs 的變數中
const exphbs = require ('express-handlebars') 
const movieList = require('./movies.json')
//設置模板引擎
//使用express-handlebars，預設佈局main
app.engine('handlebars',exphbs({defaultLayout :'main'})) 
//設定view engine裡的檔案為handlebars
app.set('view engine','handlebars') 
//設置靜態文件
app.use(express.static('public'))
// 設定路由器
app.get('/',(req,res)=>{
//渲染body內容，檔名為index,放入參數名為movie，值為movieList
  res.render('index',{movies:movieList.results})    
})
//設定搜尋路由
app.get('/search',(req,res)=>{
  const keyword = req.query.keyword
  const movies = movieList.results.filter(movie=>{
    return movie.title.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index',{ movies:movies,keyword:keyword })
})
//設定動態路由，找出相對id的電影資訊
app.get('/movies/:movie_id',(req,res)=>{
  console.log('req.params.movie_id',req.params.movie_id)
  const movie = movieList.results.find(movie => movie.id.toString() === req.params.movie_id)
  res.render('show', { movie: movie})
})


app.listen(port,()=>{
  console.log(`Express is listening on localhost:${port}`)
})