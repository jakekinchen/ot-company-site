// src/scripts/loadMorePosts.ts
import type { PostNode } from '../lib/wpFunctions';
import { getRecentPosts } from '../lib/wpFunctions';

// Declare the global variable for initial posts and count
declare global {
  interface Window {
    initialPosts: PostNode[];
    initialPostCount: number;
  }
}

const postsPerLoad = 5;
let currentPostCount = window.initialPostCount;
let allLoadedPosts = [...window.initialPosts];

async function loadMorePosts() {
  const postList = document.getElementById('postList') as HTMLUListElement;
  const loadMoreButton = document.getElementById('loadMore') as HTMLButtonElement;

  // Fetch more posts
  const newPosts = await getRecentPosts("Blog", currentPostCount + postsPerLoad);
  const nextPosts = newPosts.slice(currentPostCount);

  nextPosts.forEach(post => {
    const postElement = createPostElement(post);
    postList.appendChild(postElement);
  });

  allLoadedPosts = [...allLoadedPosts, ...nextPosts];
  currentPostCount += postsPerLoad;

  if (newPosts.length < currentPostCount + postsPerLoad) {
    loadMoreButton.style.display = 'none';
  }
}

function createPostElement(post: PostNode): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'max-h-[300px] pt-6 pb-2';
  li.innerHTML = `
    ${post.author?.node ? `<h4 class="author text-dark-blue text-medium text-xl">${post.author.node.name}</h4>` : ''}
    <a href="/blog/${post.slug}/" class="title text-dark-blue text-4xl">${post.title}</a>
    <p class="excerpt text-dark-blue">
      ${post.excerpt.length > 250 ? post.excerpt.slice(0, 250) + '...' : post.excerpt}
    </p>
    <div class="flex flex-row justify-between items-center">
      <p class="date !mb-0 text-dark-blue">${new Date(post.date).toLocaleDateString()}</p>
      <a href="/blog/${post.slug}/" class="read-more text-white px-4 py-2 bg-dark-blue rounded-3xl">Read more</a>
    </div>
  `;
  return li;
}

document.addEventListener('DOMContentLoaded', () => {
  const loadMoreButton = document.getElementById('loadMore');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadMorePosts);
  }
});