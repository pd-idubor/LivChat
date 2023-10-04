import response from '../controller/searchController';

try {
 const response = await fetch(url, options);
 const result = await response.text();
 console.log(result);
} catch (error) {
 console.error(error);
}


const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results-container");
const unavailTxt = document.getElementById("post-unavailable-txt");
let postList;
let searchValue;
let postsSearchRes;

// Function to fetch posts from the API
const fetchPosts = async () => {
 try {
   const response = await Posts.find();
	 //Call api instead with max number of code allowed or use mongo's;
   postList = await response.json();

   // Storing the Post Data in browser storage
   localStorage.setItem("postdata", JSON.stringify(postList));
   localStorage.setItem("cacheTimestamp", Date.now()); // Update cache timestamp

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
 unavailTxt.style.display = "none";
 postsSearchRes = [];

 posts.forEach((post) => {
   resultsContainer.innerHTML += `
     <div class="post-cards">
       <h2 class="title">${post.title}</h2>
       <p class="content">${post.content}</p>
       <p class="author">${post.author}</p>
       <p class="date">${post.createdAt}</p>
     </div>
   `;

   postsSearchRes.push(post);
 });
};

const cacheTimestamp = localStorage.getItem("cacheTimestamp");
const expirationDuration = 3600000; // 1 hours in milliseconds

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

searchBar.addEventListener("input", (event) => {
 searchValue = event.target.value.trim().toLowerCase();

 const filteredPosts = postList.filter((post) =>
   post.title.toLowerCase().includes(searchValue),
 );

 renderPosts(filteredPosts);

 if (postsSearchRes.length <= 0) {
  unavailTxt.style.display = "block";
 }
});

