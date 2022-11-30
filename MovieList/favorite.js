//將URL位址存放在變數裡，方便使用
const BASE_URL='https://movie-list.alphacamp.io'
const INDEX_URL= BASE_URL +'/api/v1/movies/'
const POSTER_URL= BASE_URL +'/posters/'

//DOM節點位置
const datapanel =document.querySelector('#data-panel')


//moveis陣列存放在localStorage裡
const movies = JSON.parse(localStorage.getItem('favorite',)) || []
let filteredMovies=[]

//渲染電影資料函式
function rederMoviesCard (data){
  if (movies.length > 0 ){
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
                  <button class="btn btn-danger btn-remove-favorite"data-id="${item.id}">-</button>
                </div>
              </div>
            </div>
          </div>`
  })
  datapanel.innerHTML =rawHTML
} else{ 
  datapanel.innerHTML=""
  alert("沒有喜愛清單，回到上一頁")
  window.history.back();
}
}
//addtoFavorite 
function removeFavorite (id){
  //如果沒有電影則結束函式
  if (!movies || !movies.length) return
  //設定常數movieIndex，使用findIndex查找符合點擊id的電影，在movies陣列裡的索引值，回傳
  const movieIndex = movies.findIndex((movie)=> movie.id === id)
  //如果找不到電影則結束函式
   if(movieIndex === -1) return
  //將找到的電影從movies陣列裡移除
  movies.splice(movieIndex,1)
  // 呼叫localStorage.setItem更新同步回localStorage，轉換成JSON文件的list陣列
  localStorage.setItem('favorite',JSON.stringify(movies))
  rederMoviesCard (movies)
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
  }else if (target.matches('.btn-remove-favorite'))
    removeFavorite(Number(event.target.dataset.id))   
})



rederMoviesCard (movies)

