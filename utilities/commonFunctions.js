// functions
const showSkeleton = () => {
  for (let i = 0; i < 10; ++i) {
    innerhtml += `<div class="hidden blog-card-test"></div>`;
  }
  blogSection.innerHTML = innerhtml;
  for (let i = 0; i < skeletonCard.length; ++i) {
    skeletonCard[i].classList.remove("hidden");
  }
};

const getHTML = (arr, filterArr, isAPIcall) => {
  if (!isAPIcall) showSkeleton();
  innerhtml = "";

  filterArr.forEach((item) => {
    innerhtml += `
      <div class="blog-card" id="blog-card">
        <div class="blog-img">
          <img
            id="blog-img"
            src="${item.url}"
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

  setTimeout(() => {
    blogSection.innerHTML = innerhtml;
    if (size !== 50) {
      loadMoreButton.classList.remove("hidden");
    }
    console.log({
      size,
      len: arr.length,
      actualarr: arr,
      expectedarr: filterArr,
    });
    if (size === arr.length) {
      loadMoreButton.classList.add("hidden");
    }
    if (size > arr.length) loadMoreButton.classList.add("hidden");
    if (filterElem.value !== "all" && size === 50 && isLoadMore) {
      document.querySelector("#limit").classList.remove("hidden");
      loadMoreButton.classList.add("hidden");
    }
    if (filterArr.length === 0) {
      loadMoreButton.classList.add("hidden");
      blogSection.innerHTML = `<div class="no-data">No Data Found!</div>`;
    }
    if (isAPIcall) {
      document.querySelectorAll(".blog-card").forEach((item) => {
        item.classList.add("fadeIn");
      });
    }
  }, 1000);
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
  arr = arr.filter((item) => {
    if (isFilter && isSearch) {
      if (filtervalue === "all")
        return item.title.toLowerCase().includes(inputValue.toLowerCase());
      return (
        item.title.toLowerCase().includes(inputValue.toLowerCase()) &&
        item.albumId === parseInt(filtervalue)
      );
    }
    if (isSearch) {
      return item.title.toLowerCase().includes(inputValue.toLowerCase());
    }
    if (isFilter) {
      if (isNaN(filtervalue)) return item;
      return item.albumId === parseInt(filtervalue);
    }
    return item;
  });
  let newarr = arr.slice(start, limit);

  return { arr, newarr };
};

function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const getURLParams = () => {
  url = "http://127.0.0.1:5500/album.html?";
  let obj = {
    input: inputElem?.value,
    filter: filterElem?.value,
  };
  const queryParams = new URLSearchParams(obj);
  queryString = queryParams.toString();
  window.location.href = url + queryString;
};
