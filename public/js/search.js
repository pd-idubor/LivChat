console.log("Live search file is loaded...");


const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results-container");
const unavailTxt = document.getElementById("unavailTxt");

let postList;
let searchValue;
let postsSearchRes;

// Fetch posts via api
const fetchPosts = async() => {
    try {
        const response = await fetch('/posts', {
            method: 'GET',
        });
        console.log("Response: ", response);

        postList = await response.json();

        console.log("Type of Post list: ", typeof(postList));
        console.log("Post list: ", postList);

        // Store posts data in browser storage
        /* localStorage.setItem("postdata", JSON.stringify(postList));
         localStorage.setItem("cacheTimestamp", Date.now());*/

    } catch (error) {
        unavailTxt.innerHTML =
            "An error occurred while fetching posts.<br/>Please try again later.";
        unavailTxt.style.display = "block";
        console.error(error);
    }
};

// Render posts on the page
const renderPosts = (posts) => {
    resultsContainer.innerHTML = "";
    unavailTxt.classList.add("d-none");
    postsSearchRes = [];

    if (searchBar.value.length <= 1) return;
    posts.forEach((post) => {
        console.log("Type of postid: ", typeof(post._id));
        console.log("Post id: ", post._id);
        resultsContainer.innerHTML += `
      <div class="search-card p-1 border-bottom bg-light">
        <h6 class="title"><a href="/post/${post._id}">${post.title}</a></h6>
        <p class="content">${post.content}</p>
      </div>
    `;

        postsSearchRes.push(post);
    });
};
/*
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
*/
fetchPosts();
searchBar.addEventListener("input", (event) => {
    searchValue = event.target.value.trim().toLowerCase();
    console.log("Search value: ", searchValue);

    const filteredPosts = postList.filter((post) =>
        post.content.toLowerCase().includes(searchValue),
    );

    renderPosts(filteredPosts);

    if (postsSearchRes.length <= 0) {
        unavailTxt.classList.remove("d-none");
    }
});
