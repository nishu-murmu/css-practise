let totalList = [];
let start = 0;
let innerhtml = "";
let size = 10;
let isLoadMore = false;
let isSearch = false;
let isFilter = false;
let blogCard = document.getElementsByClassName("blog-card");
let blogSection = document.getElementById("blog-section");
let skeletonCard = document.getElementsByClassName("blog-card-test");
let radialLoader = document.getElementById("loader");
let loadMoreButton = document.getElementById("load-more");
let inputElem = document.getElementById("search-text");
let filterElem = document.getElementById("filters");
let clearButton = document.getElementById("clear");

// common functions
const removeLoader = () => {
  radialLoader.classList.add("hidden");
};
const removeSkeleton = () => {
  for (let i = 0; i < skeletonCard.length; ++i) {
    skeletonCard[i].classList.add("hidden");
  }
};
const showSkeleton = () => {
  for (let i = 0; i < 10; ++i) {
    innerhtml += `<div class="hidden blog-card-test"></div>`;
  }
  blogSection.innerHTML = innerhtml;
  for (let i = 0; i < skeletonCard.length; ++i) {
    skeletonCard[i].classList.remove("hidden");
  }
};

const getHTML = (arr) => {
  innerhtml = "";
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
`;
  });
  blogSection.innerHTML = innerhtml;
};

const getFilters = (
  arr,
  inputValue,
  filtervalue,
  isLoadMore,
  isSearch,
  isFilter,
  limit
) => {
  if (isSearch) {
    arr = arr.filter((item) =>
      item.title.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  if (isFilter) {
    arr = arr.filter((item) => {
      return item.albumId === parseInt(filtervalue);
    });
  }

  if (isFilter && isSearch) {
    arr = arr.filter((item) => {
      return (
        item.title.toLowerCase().includes(inputValue.toLowerCase()) &&
        item.albumId === parseInt(filtervalue)
      );
    });
  }
  arr = arr.slice(start, limit);

  if (arr.length < 10) {
    loadMoreButton.classList.add("hidden");
  }

  return arr;
};

// functions
function getPhotos() {
  showSkeleton();
  inputElem.value = "";

  setTimeout(async () => {
    await fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((data) => {
        totalList = data;
      });

    const resultArray = getFilters(
      totalList,
      inputElem.value,
      filterElem.value,
      isLoadMore,
      isSearch,
      isFilter,
      size
    );
    getHTML(resultArray);

    for (let i = 0; i < blogCard.length; ++i) {
      blogCard[i].classList.remove("hidden");
    }
  }, 2000);
  setTimeout(() => {
    // removeLoader();
    removeSkeleton();
  }, 2100);
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
  );
  getHTML(resultArray);
};

const filter = (value, isFilter) => {
  const resultArray = getFilters(
    totalList,
    inputElem.value,
    value,
    isLoadMore,
    isSearch,
    isFilter,
    size
  );
  getHTML(resultArray);
};

// function to get photos from the api
getPhotos(0, size);

// function to load more photos
loadMoreButton.onclick = () => {
  isLoadMore = true;
  size += 10;
  const resultArray = getFilters(
    totalList,
    inputElem.value,
    filterElem.value,
    isLoadMore,
    isSearch,
    isFilter,
    size
  );
  getHTML(resultArray);
};

// function to search photos
inputElem.addEventListener("change", () => {
  isSearch = true;
  size = 10;
  search(inputElem.value, isSearch);
});

clearButton.addEventListener("click", () => {
  inputElem.value = "";
  isSearch = false;
  size = 10;
  search(inputElem.value, isSearch);
});

// function to filter photos
filterElem.addEventListener("change", () => {
  if (filterElem.value === "all") {
    isFilter = false;
    size = 10;
    filter(filterElem.value, isFilter);
  } else {
    isFilter = true;
    size = 10;
    filter(filterElem.value, isFilter);
  }
});
