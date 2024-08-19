// File: src/lib/blogPosts.ts

import type { Post } from '../types';
import { GET_POST } from '../queries';

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

const GET_ALL_BLOG_POST_SLUGS = `
  query GetAllBlogPostSlugs($first: Int!, $after: String) {
    posts(
      first: $first, 
      after: $after, 
      where: {categoryName: "Blog"}
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
      }
    }
  }
`;

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
