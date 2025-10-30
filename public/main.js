const getPostsBtn = document.getElementById("refresh-posts");
const postsContainer = document.getElementById("posts");
const form = document.querySelector("form");
const titleInput = document.getElementById("title");

async function getPosts() {
	try {
		const data = await fetch("http://localhost:8000/api/posts");
		const posts = await data.json();
		return posts;
	} catch (error) {
		console.error(error);
	}
}

const init = async () => mapper(await getPosts());
getPostsBtn.addEventListener("click", init);
init();

async function addPost(e) {
	e.preventDefault();
	console.log(e.srcElement);
	const fd = new FormData(e.srcElement);

	console.log(fd);

	const res = await fetch("http://localhost:8000/api/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title }),
	});
	if (res.ok) {
		const posts = await res.json();
		mapper(posts);
		return;
	}
}

form.addEventListener("submit", addPost);

// Helper Functions
function mapper(posts) {
	postsContainer.innerHTML = "";
	if (!posts) {
		postsContainer.innerHTML = "<h1>No Posts yet, try create one</h1>";
		return;
	}
	posts.forEach((post) => {
		postsContainer.innerHTML += generatePostElement(post);
	});
}

function generatePostElement(post) {
	const element = `<div data-id="${post.id}">
    ${post.title}
      <div class="btns">
        <button>❌</button>
        <button>✏️</button>
      </div>
    </dvi>`;
	return element;
}
