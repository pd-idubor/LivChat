
try {
 const response = await fetch(url, options);
 const result = await response.text();
 console.log(result);
} catch (error) {
 console.error(error);
}


const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results-container");
const postUnavailableTxt = document.getElementById("post-unavailable-txt");
let postList;
let searchValue;
let postsReturnedOnSearch;

// Function to fetch posts from the API
const fetchPosts = async () => {
 try {
   const response = await Posts.find();
   postList = await response.json();

   // Storing the Post Data in browser storage
   localStorage.setItem("postdata", JSON.stringify(postList));
   localStorage.setItem("cacheTimestamp", Date.now()); // Update cache timestamp

   // Render the posts on the page
   renderPosts(postList);
 } catch (error) {
   postUnavailableTxt.innerHTML =
     "An error occurred while fetching posts. <br /> Please try again later.";
   postUnavailableTxt.style.display = "block";
   console.error(error);
 }
};

// Function to render posts on the page
const renderPosts = (posts) => {
 resultsContainer.innerHTML = ""; // Clear the existing posts
 postUnavailableTxt.style.display = "none"; // Hide the "No posts found" message
 postsReturnedOnSearch = []; // Clear the posts returned on search array

 posts.forEach((post) => {
   resultsContainer.innerHTML += `
     <div class="post-cards">
       <img src="${post.image}" alt="post image" class="post-image" />
       <h2 class="title">${post.title}</h2>
       <p class="plot">${post.description}</p>
       <p class="date">${post.year}</p>
     </div>
   `;

   postsReturnedOnSearch.push(post); // Add the posts that are a result to the search input value
 });
};

const cacheTimestamp = localStorage.getItem("cacheTimestamp");
const expirationDuration = 21600000; // 6 hours in milliseconds

// Check if cache has expired or data is not available
if (
 !cacheTimestamp ||
 Date.now() - parseInt(cacheTimestamp) > expirationDuration
) {
 // Cache expired or data not available, fetch posts again
 fetchPosts();
} else {
 // Use cached post data
 postList = JSON.parse(localStorage.getItem("postdata"));
 renderPosts(postList);
}

// Event listener and handler for search bar input
searchBar.addEventListener("input", (event) => {
 searchValue = event.target.value.trim().toLowerCase();

 // Filter posts based on search input
 const filteredPosts = postList.filter((post) =>
   post.title.toLowerCase().includes(searchValue),
 );

 // Render the filtered posts on the page
 renderPosts(filteredPosts);

 if (postsReturnedOnSearch.length <= 0) {
   postUnavailableTxt.style.display = "block"; // Show the "No posts found" message if no posts match the search
 }
});

