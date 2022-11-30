//將URL位址存放在變數裡，方便使用
const BASE_URL='https://movie-list.alphacamp.io'
const INDEX_URL= BASE_URL +'/api/v1/movies/'
const POSTER_URL= BASE_URL +'/posters/'

//DOM節點位置
const datapanel =document.querySelector('#data-panel')
const searchform= document.querySelector('#search-form')
const searchinput=document.querySelector('#search-input')
const paginator=document.querySelector('#paginator')

//設定常數存放
const movies =[]
let filteredMovies=[]
//設定分割頁面數
const MOVIES_PER_PAGE =12
const INIT_PAGE =1 


//使用API取得電影資料，使用展開運算子將movie陣列一一放進movies陣列
axios.get(INDEX_URL)
.then((response)=>{
const movie = response.data.results
movies.push(...movie)
renderPagintor(movies.length)
rederMoviesCard (getMoviesByPage(1))
})
.catch((err)=>{
  console.log(err)
})


//渲染電影資料函式
function rederMoviesCard (data){
let rawHTML=''
data.forEach(item => {
  rawHTML+= `<div class="col-sm-3 mt-3">
             <div class="mb-2">
              <div class="card ">
                <img
                  src="${POSTER_URL+item.image}"
                  class="card-img-top"
                  alt="Movie Poster"
                />
                <div class="card-body ">
                  <h5 class="card-title">${item.title}</h5>
                </div>
                <div class="card-footer">
                  <button
                    class="btn btn-primary btn-show-movie"
                    data-bs-toggle="modal"
                    data-bs-target="#movie-modal"
                    data-id="${item.id}"
                  >
                    More
                  </button>
                  <button class="btn btn-info btn-add-favorite"data-id="${item.id}">+</button>
                </div>
              </div>
            </div>
          </div>`
});
datapanel.innerHTML =rawHTML
//重新確認當前頁面
checkPaginator()
}
// 確認目前分頁位置
function checkPaginator(){
const activePage = document.querySelector('.page-item.active .page-link')
//如果初始頁面沒有active(即分頁沒有任何active存在)，則將第一頁設為初始狀態
if (activePage === null){
  activePaginator(INIT_PAGE);
} else{
  activePaginator(Number(activePage.dataset.page))
} 
}

function activePaginator(page){
  //抓取item有active標籤名存放在常數內
  const activePagination=document.querySelector('.page-item.active')
  //如果有則移除標籤名active
  if (activePagination){
    activePagination.classList.remove('active')
  }
  //將所有<a>超連結的標籤名存放在allpage內，取出為一個陣列
  const allpage =document.querySelectorAll('.page-link')
  //使用forEach遍歷所有<a>link，dataset.page符合點擊的page
  //則在<li>新增一個active的class名
  allpage.forEach((link)=>{
    if(Number(link.dataset.page) === page){
    link.parentElement.classList.add('active')
  }})
}








//渲染分頁

function renderPagintor(amount){
  // 使用ceil 無條件進位。總數/分頁數
  const numberofpage = Math.ceil(amount/MOVIES_PER_PAGE)
  rawHTML=''
  for(let page = 1 ; page <= numberofpage ; page++){
  rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
   paginator.innerHTML = rawHTML
}

//addtoFavorite 
function addToFavorite (id){
  // 設定常數 list 是 favorite陣列 或 空陣列，取得localStorage資料 轉換為js型態
  const list = JSON.parse(localStorage.getItem('favorite',)) || []
  // moive 常數 = movies 陣列裡，尋找電影id符合點擊id，find找到第一個符合救回傳
  const movie = movies.find((movie)=> movie.id === id)
  // 查找localStorage的list陣列裡，有沒有符合點擊的id，有的話則retuen 並跳出警告視窗
  //.some只會檢查裡面有沒有，有則回傳turn，沒有則回傳flase，some回傳的是布林值
  if (list.some((movie)=> movie.id===id)){
    return alert('此電影已在收藏清單中')
  }
  //沒有的話，則新增該電影的物件，存到list陣列裡
  list.push(movie)
  // 呼叫localStorage.setItem更新同步回localStorage，轉換成JSON文件的list陣列
  localStorage.setItem('favorite',JSON.stringify(list))
}

//分割頁面
function getMoviesByPage(page){
  //使用三元運算子 判斷filteredMovies搜尋欄裡有沒有東西
  //有的話選filteredMovies，沒有的話選movies
  const data = filteredMovies.length ? filteredMovies : movies
  //起始位置 index
  const start = (page-1) * MOVIES_PER_PAGE

  return data.slice(start, start + MOVIES_PER_PAGE)

}


//showModal
function showMovieModal (id){
//DOM節點
const title =document.querySelector('#movie-modal-title')
const movieimg =document.querySelector('#movie-modal-image')
const date =document.querySelector('#movie-modal-date')
const description =document.querySelector('#movie-modal-description')

//避免發生上一個項目的殘影
title.innerText=''
movieimg.innerHTML=''
date.innerText=''
description.innerText=''

axios.get(INDEX_URL + id)
.then((response)=>{
  //title description image release_date
const data = response.data.results  
title.innerText = data.title
movieimg.innerHTML=`<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
date.innerText= '發布日期:' + data.release_date
description.innerText= data.description

})
}

//監聽datapanel，Card父層

datapanel.addEventListener('click',function onMoiveModelClicked(event){
  const target = event.target
  if(target.matches('.btn-show-movie')){
    showMovieModal (Number(event.target.dataset.id))   
  }else if (target.matches('.btn-add-favorite'))
    addToFavorite(Number(event.target.dataset.id))   
})
//監聽分頁按鈕
paginator.addEventListener('click',function onPageClick(event){
 const target = event.target
 //如果點擊不是<a>超連結 則結束函式
 if(target.tagName !=='A') return
 //設定page常數 存放 li裡面的data-page數字
 const page =Number(target.dataset.page)
 //渲染該頁面的電影資料
 rederMoviesCard (getMoviesByPage(page))
//當前頁面點擊新增active效果
  activePaginator(page)
})




searchform.addEventListener('submit',function onSearchFromSubmitted(event){
  //預防預設行為重整頁面
  event.preventDefault()
  //input的值，trim()防止前後空白輸入，toLowerCase轉換成小寫
  const keyword = searchinput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie)=>
    movie.title.toLowerCase().includes(keyword)
  )
  if(!keyword.length){
    alert('輸入有效文字')
  }
  if(filteredMovies.length===0){
    return alert(`輸入的關鍵字有誤${keyword}`)
  }
  renderPagintor(filteredMovies.length)
  rederMoviesCard(getMoviesByPage(1))

})