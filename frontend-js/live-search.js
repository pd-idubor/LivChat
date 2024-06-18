import db from '../models/index.js';

console.log("Live search file is loading...");

const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results-container");
const unavailTxt = document.getElementById("unavailTxt");

let postList;
let searchValue;
let postsSearchRes;

// Fetch posts from the DB
const fetchPosts = async() => {
    try {
        const response = await db.posts.find();
        //Call api instead with max number of code allowed or use mongo's;
        postList = await response.json();
        console.log("Post list: ", postList);

        // Store posts data in browser storage
        localStorage.setItem("postdata", JSON.stringify(postList));
        localStorage.setItem("cacheTimestamp", Date.now());

        // Render the posts on the page
        renderPosts(postList);
    } catch (error) {
        unavailTxt.innerHTML =
            "An error occurred while fetching posts. <br /> Please try again later.";
        unavailTxt.style.display = "block";
        console.error(error);
    }
};

// Render posts on the page
const renderPosts = (posts) => {
    resultsContainer.innerHTML = "";
    unavailTxt.classList.add("d-none");
    postsSearchRes = [];

    posts.forEach((post) => {
        resultsContainer.innerHTML += `
      <div class="post-cards">
        <h4 class="title">${post.title}</h4>
        <p class="content">${post.content}</p>
        <p class="author">${post.user}</p>
        <p class="date">${post.createdAt}</p>
      </div>
    `;

        postsSearchRes.push(post);
    });
};

const cacheTimestamp = localStorage.getItem("cacheTimestamp");
const expirationDuration = 3600000; // 1 hours in milliseconds

// Check if cache has expired or data is not available
if (!cacheTimestamp ||
    Date.now() - parseInt(cacheTimestamp) > expirationDuration
) {
    // Cache expired or data not available, fetch posts again
    fetchPosts();
} else {
    // Use cached post data
    postList = JSON.parse(localStorage.getItem("postdata"));
    renderPosts(postList);
}

searchBar.addEventListener("input", (event) => {
    searchValue = event.target.value.trim().toLowerCase();

    const filteredPosts = postList.filter((post) =>
        post.title.toLowerCase().includes(searchValue),
    );

    renderPosts(filteredPosts);

    if (postsSearchRes.length <= 0) {
        unavailTxt.classList.remove("d-none");
    }
});