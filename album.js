let totalList = []
let url = ""
let queryString = ""
let start = 0
let innerhtml = ""
let size = 10
let isLoadMore = false
let isSearch = false
let isFilter = false
let blogCard = document.getElementsByClassName("blog-card")
let blogSection = document.getElementById("blog-section")
let skeletonCard = document.getElementsByClassName("blog-card-test")
let radialLoader = document.getElementById("loader")
let loadMoreButton = document.getElementById("load-more")
let inputElem = document.getElementById("search-text")
let filterElem = document.getElementById("filters")
let clearButton = document.getElementById("clear")

const showSkeleton = () => {
  for (let i = 0; i < 10; ++i) {
    innerhtml += `<div class="hidden blog-card-test"></div>`
  }
  blogSection.innerHTML = innerhtml
  for (let i = 0; i < skeletonCard.length; ++i) {
    skeletonCard[i].classList.remove("hidden")
  }
}

const getHTML = (arr, isAPIcall) => {
  showSkeleton()
  innerhtml = ""

  arr.forEach((item) => {
    innerhtml += `
      <div class="blog-card" id="blog-card">
        <div class="blog-img">
          <img
            id="blog-img"
            src="${item.url}"
            alt="samosa"
          />
        </div>
        <div class="card-body">
          <p id="blog-description" class="card-description">
              ${item.title}
          </p>
          <div class="card-buttons">
            <div class="button-wrapper">
              <button class="button button-outline">${item.albumId}</button>
              <button class="button button-outline">${item.id}</button>
            </div>
              <p class="time-line"><small>${new Date().toLocaleTimeString()}</small></p>
          </div>
        </div>
      </div>
  `
  })

  setTimeout(() => {
    blogSection.innerHTML = innerhtml
  }, 1000)

  if (isAPIcall) {
    document.querySelectorAll(".blog-card").forEach((item) => {
      item.classList.add("fadeIn")
    })
  }
}

const getFilters = (
  arr,
  inputValue,
  filtervalue,
  isLoadMore,
  isSearch,
  isFilter,
  limit
) => {
  arr = arr.filter((item) => {
    if (isFilter && isSearch) {
      return (
        item.title.toLowerCase().includes(inputValue.toLowerCase()) &&
        item.albumId === parseInt(filtervalue)
      )
    }
    if (isSearch) {
      return item.title.toLowerCase().includes(inputValue.toLowerCase())
    }
    if (isFilter) {
      if (isNaN(filtervalue)) return item
      return item.albumId === parseInt(filtervalue)
    }
    // return item
  })
  arr = arr.slice(start, limit)

  if (limit === 50 && isLoadMore) {
    document.querySelector("#limit").classList.remove("hidden")
    loadMoreButton.classList.add("hidden")
  }
  if (size > arr.length) {
    loadMoreButton.classList.add("hidden")
  }
  if (arr.length == 10) {
    document.querySelector("#limit").classList.add("hidden")
    loadMoreButton.classList.remove("hidden")
  }

  return arr
}

// functions
function getPhotos(inputValue, filterValue, isSearch, isFilter, isQuery) {
  showSkeleton()

  setTimeout(async () => {
    await fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((data) => {
        totalList = data
      })

    const resultArray = getFilters(
      totalList,
      inputValue,
      filterValue,
      isLoadMore,
      isSearch,
      isFilter,
      size,
      isQuery
    )
    getHTML(resultArray, true)
  }, 2000)
}

const search = (inputValue, isSearch) => {
  const resultArray = getFilters(
    totalList,
    inputValue,
    filterElem.value,
    isLoadMore,
    isSearch,
    isFilter,
    size
  )
  getHTML(resultArray)
}

const filter = (value, isFilter) => {
  const resultArray = getFilters(
    totalList,
    inputElem.value,
    value,
    isLoadMore,
    isSearch,
    isFilter,
    size
  )
  getHTML(resultArray)
}

// function to get photos from the api
const getURLParams = () => {
  url = "http://127.0.0.1:5500/album.html?"
  let obj = {
    input: inputElem?.value,
    filter: filterElem?.value,
  }
  const queryParams = new URLSearchParams(obj)
  queryString = queryParams.toString()
  window.location.href = url + queryString
}

window.onload = () => {
  try {
    let url = new URL(window.location.href)
    inputElem.value = url.searchParams.get("input")
    filterElem.value = url.searchParams.get("filter")

    if (filterElem.value) isFilter = true

    if (inputElem.value) isSearch = true
    if (inputElem.value || filterElem.value) {
      getPhotos(inputElem.value, filterElem.value, isSearch, isFilter, true)
    } else {
      getPhotos(inputElem.value, filterElem.value, isSearch, isFilter, false)
    }
  } catch (err) {
    console.log(err)
  }
}

// function to load more photos
loadMoreButton.onclick = () => {
  isLoadMore = true
  size += 10
  const resultArray = getFilters(
    totalList,
    inputElem.value,
    filterElem.value,
    isLoadMore,
    isSearch,
    isFilter,
    size
  )
  getHTML(resultArray)
}

// function to search photos
inputElem.addEventListener("keyup", () => {
  isSearch = true
  size = 10
  search(inputElem.value, isSearch)
  // getURLParams()
})

inputElem.addEventListener("change", () => getURLParams())

clearButton.addEventListener("click", () => {
  inputElem.value = ""
  isSearch = false
  size = 10
  search(inputElem.value, isSearch)
  getURLParams()
})

// function to filter photos
filterElem.addEventListener("change", () => {
  if (filterElem.value === "all") {
    isFilter = false
    size = 10
    filter(filterElem.value, isFilter)
  } else {
    isFilter = true
    size = 10
    filter(filterElem.value, isFilter)
  }
  getURLParams()
})
