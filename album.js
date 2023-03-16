let list;
let blogCard = document.getElementsByClassName("blog-card");
let firstCard = document.getElementsByClassName("blog-card")[0];
let blogSection = document.getElementById("blog-section");
let skeletonCard = document.getElementsByClassName("blog-card-test");
let radialLoader = document.getElementById("loader");
const removeLoader = () => {
  radialLoader.classList.add("hidden");
};
const removeSkeleton = () => {
  for (let i = 0; i < skeletonCard.length; ++i) {
    skeletonCard[i].classList.add("hidden");
  }
};
function getPhotos() {
  firstCard.classList.add("hidden");
  setTimeout(async () => {
    await fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((data) => {
        list = data.slice(0, 10);
      });
    console.log(list);
    list.forEach((item) => {
      let node = document.getElementById("blog").cloneNode(true);
      node.childNodes[1].childNodes[1].src = item.url;
      node.childNodes[2].nextSibling.childNodes[1].innerText = item.title;
      node.childNodes[2].nextSibling.childNodes[3].childNodes[3].innerText =
        new Date().toLocaleTimeString();
      blogSection.appendChild(node);
    });
    firstCard.remove();
    for (let i = 0; i < blogCard.length; ++i) {
      blogCard[i].classList.remove("hidden");
    }
  }, 2000);
  setTimeout(() => {
    // removeLoader();
    removeSkeleton();
  }, 2100);
}

getPhotos();
