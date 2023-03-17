let list;
let totalList = [];
let sumlist = [];
let start = 0;
let innerhtml = "";
let size = 10;
let blogCard = document.getElementsByClassName("blog-card");
let blogSection = document.getElementById("blog-section");
let skeletonCard = document.getElementsByClassName("blog-card-test");
let radialLoader = document.getElementById("loader");
let loadMoreButton = document.getElementById("load-more");
let inputElem = document.getElementById("search-text");
let filterElem = document.getElementById("filters");

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

const getHTML = (url, title, id) => {
  return `
            <div class="blog-card" id="blog-card">
              <div class="blog-img">
                <img
                  id="blog-img"
                  src="${url}"
                  alt="samosa"
                />
              </div>
              <div class="card-body">
                <p id="blog-description" class="card-description">
                    ${title}
                </p>
                <div class="card-buttons">
                  <div class="button-wrapper">
                    <button class="button button-outline">${id}</button>
                    <button class="button button-outline">Edit</button>
                  </div>
                    <p class="time-line"><small>${new Date().toLocaleTimeString()}</small></p>
                </div>
              </div>
            </div>
`;
};

const injectHTML = (arr, limit, inputValue, filtervalue) => {
  innerhtml = "";
  let updatearr = [];
  arr.forEach((item) => {
    if (limit && item.id <= limit) {
      innerhtml += getHTML(item.url, item.title, item.albumId);
    }
    if (inputValue && item.title.includes(inputValue.toLowerCase())) {
      innerhtml += getHTML(item.url, item.title, item.albumId);
    }
    if (filtervalue && item.albumId == filtervalue) {
      updatearr.push(item);
      innerhtml += getHTML(item.url, item.title, item.albumId);
    }
  });
  sumlist.push(...sumlist, ...updatearr);
  sumlist = [...new Map(sumlist.map((item) => [item["id"], item])).values()];
  blogSection.innerHTML = innerhtml;
};

const removeHTML = () => {
  while (blogSection.hasChildNodes()) {
    blogSection.firstChild.remove();
  }
};

// functions
function getPhotos(start, length, filterValue) {
  showSkeleton();

  setTimeout(async () => {
    await fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((data) => {
        list = data.slice(start, length);
        totalList = data;
      });
    sumlist.push(...sumlist, ...list);

    sumlist = [...new Map(sumlist.map((item) => [item["id"], item])).values()];
    injectHTML(sumlist, length, "", filterValue);

    for (let i = 0; i < blogCard.length; ++i) {
      blogCard[i].classList.remove("hidden");
    }
  }, 2000);
  setTimeout(() => {
    // removeLoader();
    removeSkeleton();
  }, 2100);
}

function getMorePhotos(start, end) {
  if (start !== undefined && end !== undefined) {
    totalList.forEach((item) => {
      if (item.id >= start && item.id <= end) {
        sumlist.push(item);
      }
    });
  }
  injectHTML(sumlist, length, "", filterElem.value, true);
}

const search = () => {
  let inputValue = document.getElementById("search-text").value;
  if (inputValue !== "") {
    removeHTML();
    innerhtml = "";
    injectHTML(sumlist, length, inputValue, 0);
  } else {
    removeHTML();
    getMorePhotos();
  }
};

const filter = (value) => {
  innerhtml = "";
  injectHTML(totalList, length, "", value);
};

// function to get photos from the api
getPhotos(0, size);

// function to load more photos
loadMoreButton.onclick = () => {
  getMorePhotos((start += 10), (size += 10));
};

// function to search photos
inputElem.addEventListener("change", () => {
  search();
});

// function to filter photos
filterElem.addEventListener("change", () => filter(filterElem.value));
