const URL = "https://pixabay.com/api/";
const key = "38310051-69ca302f12664ae614629a441";

const imgElement = document.querySelector(".main-img");
const button = document.querySelector(".generate-btn");

async function fetchRandomImage() {
    const res = await fetch(`${URL}?key=${key}&q=food&image_type=photo&per_page=200`);
    const data = await res.json();

    const randomIndex = Math.floor(Math.random() * data.hits.length);
    const item = data.hits[randomIndex];

    imgElement.src = item.largeImageURL;
    imgElement.alt = item.tags || "food";

    console.log(item)
}



button.addEventListener("click", fetchRandomImage);
