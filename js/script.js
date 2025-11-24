const api_URL = "https://pixabay.com/api/";
const key = "38310051-69ca302f12664ae614629a441";

const imgElement = document.querySelector(".main-img");
const button = document.querySelector(".generate-btn");
const linkImage = document.querySelector(".link-image")

async function fetchRandomImage() {
    button.disabled = true;
    button.textContent = "Loading...";

    const res = await fetch(`${api_URL}?key=${key}&q=food&image_type=photo&per_page=200`);
    const data = await res.json();

    const randomIndex = Math.floor(Math.random() * data.hits.length);
    const item = data.hits[randomIndex];

    const tempImg = new Image();
    tempImg.src = item.largeImageURL;

    const loadPromise = new Promise((resolve) => {
        tempImg.onload = resolve;
    });

    const timeoutPromise = new Promise((resolve) => {
        setTimeout(resolve, 450);
    });

    await Promise.all([loadPromise, timeoutPromise]);

    imgElement.src = tempImg.src;
    imgElement.alt = item.tags || "food";

    linkImage.href = item.largeImageURL;

    button.textContent = "Random photo";
    button.disabled = false;
}

button.addEventListener("click", fetchRandomImage);
