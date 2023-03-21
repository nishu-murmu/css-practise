
// main API function
async function getPhotos(inputValue, filterValue, isSearch, isFilter) {
  showSkeleton()
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
  )
  getHTML(resultArray.arr, resultArray.newarr, true)
}

const processChange = debounce(() => getURLParams());


// event handlers
window.onload = () => {
  try {
    let url = new URL(window.location.href)
    if (url.href === "http://127.0.0.1:5500/album.html") window.location.href = url.href + `?input=${inputElem.value}&filter=${filterElem.value}`
    inputElem.value = url.searchParams.get("input")
    filterElem.value = url.searchParams.get("filter")

    if (filterElem.value) isFilter = true

    if (inputElem.value) isSearch = true
    if (inputElem.value || filterElem.value) {
      getPhotos(inputElem.value, filterElem.value, isSearch, isFilter)
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
  getHTML(resultArray.arr, resultArray.newarr)
}

// function to search photos
inputElem.addEventListener("keyup", () => {
  isSearch = true
  size = 10
  processChange()
})

clearButton.addEventListener("click", () => {
  inputElem.value = ""
  isSearch = false
  size = 10
  getURLParams()
})

// function to filter photos
filterElem.addEventListener("change", () => {
  if (filterElem.value === "all") {
    isFilter = false
    size = 10
  } else {
    isFilter = true
    size = 10
  }
  getURLParams()
})
