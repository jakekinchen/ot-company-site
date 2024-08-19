// File: src/lib/blogPosts.ts

import type { Post } from '../types';
import { GET_POST, GET_POST_ITEMS, GET_NEWS_ITEMS, GET_NEWS_POST, GET_ALL_BLOG_POST_SLUGS, GET_ALL_NEWS_POST_SLUGS, GET_ALL_POST_SLUGS, GET_LATEST_BLOG_POST } from '../queries';

interface PostNode {
  slug: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface PostsResponse {
  posts: {
    pageInfo: PageInfo;
    nodes: PostNode[];
  };
}

interface GraphQLResponse {
  data: PostsResponse;
}



export async function getPosts() {
    try {
      console.log('Fetching posts...');
      const res = await fetch('https://onetier.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GET_POST_ITEMS,
        }),
      });
  
      if (!res.ok) {
        console.error('Failed to fetch data:', res.statusText, "Entire response:", res);
        return [];
      }
  
      const jsonData = await res.json();
  
      if (!jsonData.data || !jsonData.data.posts || !jsonData.data.posts.nodes) {
        console.error('Unexpected API response structure:', res);
        return [];
      }
  
      const posts = jsonData.data.posts.nodes;
      //console.log('Fetched posts:', posts);
      console.log("Posts fetched successfully");
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  export async function getLatestBlogPost(): Promise<Post | null> {
    try {
      const res = await fetch('https://onetier.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: GET_LATEST_BLOG_POST,
        }),
      });
  
      if (!res.ok) {
        console.error('Failed to fetch latest blog post:', res.statusText);
        return null;
      }
  
      const { data } = await res.json();
      if (!data || !data.posts || !data.posts.nodes || data.posts.nodes.length === 0) {
        console.error('Unexpected API response structure:', data);
        return null;
      }
  
      const latestPost = data.posts.nodes[0];
      return latestPost;
    } catch (error) {
      console.error('Error fetching latest blog post:', error);
      return null;
    }
  }
    

export async function getNewsPosts() {
    try {
        console.log('Fetching news posts...');
        const res = await fetch('https://onetier.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: GET_NEWS_ITEMS,
        }),
        });
    
        if (!res.ok) {
        console.error('Failed to fetch data:', res.statusText, "Entire response:", res);
        return [];
        }
    
        const jsonData = await res.json();
    
        if (!jsonData.data || !jsonData.data.posts || !jsonData.data.posts.nodes) {
        console.error('Unexpected API response structure:', res);
        return [];
        }
    
        const posts = jsonData.data.posts.nodes;
        //console.log('Fetched posts:', posts);
        console.log("News posts fetched successfully");
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    }

export async function getAllBlogPosts(): Promise<PostNode[]> {
  let allPosts: PostNode[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const res: Response = await fetch('https://onetier.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: GET_ALL_BLOG_POST_SLUGS,
        variables: { first: 100, after },
      }),
    });

    if (!res.ok) {
      console.error('Failed to fetch data:', res.statusText);
      break;
    }

    const { data }: GraphQLResponse = await res.json();
    if (!data || !data.posts || !data.posts.nodes) {
      console.error('Unexpected API response structure:', data);
      break;
    }

    allPosts = [...allPosts, ...data.posts.nodes];
    hasNextPage = data.posts.pageInfo.hasNextPage;
    after = data.posts.pageInfo.endCursor;
  }

  return allPosts;
}

export async function getAllNewsPosts(): Promise<PostNode[]> {
    let allPosts: PostNode[] = [];
    let hasNextPage = true;
    let after: string | null = null;
  
    while (hasNextPage) {
      const res: Response = await fetch('https://onetier.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: GET_ALL_NEWS_POST_SLUGS,
          variables: { first: 100, after },
        }),
      });
  
      if (!res.ok) {
        console.error('Failed to fetch data:', res.statusText);
        break;
      }
  
      const { data }: GraphQLResponse = await res.json();
      if (!data || !data.posts || !data.posts.nodes) {
        console.error('Unexpected API response structure:', data);
        break;
      }
  
      allPosts = [...allPosts, ...data.posts.nodes];
      hasNextPage = data.posts.pageInfo.hasNextPage;
      after = data.posts.pageInfo.endCursor;
    }
  
    return allPosts;
  }

export async function getPostData(slug: string): Promise<Post | null> {
  const postRes = await fetch('https://onetier.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_POST,
      variables: { slug }
    }),
  });

  if (!postRes.ok) {
    console.error(`Failed to fetch post with slug ${slug}:`, postRes.statusText);
    return null;
  }

  const { data: postData }: { data?: { post?: Post } } = await postRes.json();
  if (!postData || !postData.post) {
    console.error(`Unexpected API response structure for post with slug ${slug}:`, postData);
    return null;
  }

  // Double-check that the post is in the Blog category
  if (!postData.post.categories.nodes.some(cat => cat.name === "Blog")) {
    console.warn(`Post with slug ${slug} is not in the Blog category, skipping`);
    return null;
  }

  return postData.post;
}
