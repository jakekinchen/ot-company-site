// src/wp-functions.ts
import fs from 'fs';
import path from 'path';
import { GET_POST, GET_POSTS, GET_POST_SLUGS } from '../queries';

export interface PostNode {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  author: { node: { name: string } };
  categories: { nodes: Array<{ name: string }> };
  tags: { nodes: Array<{ name: string }> };
  featuredImage?: { node: { sourceUrl: string; altText: string } };
  seo: {
    title: string;
    metaDesc: string;
    focuskw: string;
    metaKeywords: string;
    metaRobotsNoindex: string;
    metaRobotsNofollow: string;
    opengraphTitle: string;
    opengraphDescription: string;
    opengraphImage: {
      sourceUrl: string;
    };
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: {
      sourceUrl: string;
    };
  };
}

export interface PostExport extends PostNode {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  author: { node: { name: string } };
  categories: { nodes: Array<{ name: string }> };
  tags: { nodes: Array<{ name: string }> };
  featuredImage?: { node: { sourceUrl: string; altText: string } };
  seo: {
    title: string;
    metaDesc: string;
    focuskw: string;
    metaKeywords: string;
    metaRobotsNoindex: string;
    metaRobotsNofollow: string;
    opengraphTitle: string;
    opengraphDescription: string;
    opengraphImage: {
      sourceUrl: string;
    };
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: {
      sourceUrl: string;
    };
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface GraphQLResponse {
  data: {
    posts?: {
      pageInfo: PageInfo;
      nodes: PostNode[];
    };
    post?: PostNode;
  };
}

const API_URL = 'https://onetier.com/graphql';

async function fetchGraphQL(query: string, variables = {}): Promise<GraphQLResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  return await res.json();
}

async function fetchAllPosts(category: string | null, slugsOnly: boolean = false): Promise<PostNode[]> {
  let allPosts: PostNode[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const { data } = await fetchGraphQL(
        slugsOnly ? GET_POST_SLUGS : GET_POSTS,
        { first: 100, after, category }
      );

      if (!data.posts) throw new Error('Unexpected API response structure');

      allPosts = [...allPosts, ...data.posts.nodes];
      hasNextPage = data.posts.pageInfo.hasNextPage;
      after = data.posts.pageInfo.endCursor;
    } catch (error) {
      console.error('Error fetching posts:', error);
      break;
    }
  }

  return allPosts;
}

export async function getAllPostSlugs(category: string | null = null): Promise<string[]> {
  const posts = await fetchAllPosts(category, true);
  return posts.map(post => post.slug);
}

export async function getRecentPosts(category: string | null = null, count: number = 10): Promise<PostNode[]> {
  try {
    const response = await fetchGraphQL(GET_POSTS, { first: count, category });
    
    if (!response.data) {
      console.error('Unexpected API response structure: data is undefined');
      return [];
    }
    
    if (!response.data.posts) {
      console.error('Unexpected API response structure: data.posts is undefined');
      return [];
    }
    
    if (!Array.isArray(response.data.posts.nodes)) {
      console.error('Unexpected API response structure: data.posts.nodes is not an array');
      return [];
    }
    
    return response.data.posts.nodes;
  } catch (error) {
    console.error('Error in getRecentPosts:', error);
    return [];
  }
}

export async function getLatestPost(category: string | null = null): Promise<PostNode | null> {
  const posts = await getRecentPosts(category, 1);
  return posts[0] || null;
}

export async function getAllPosts(category: string | null = null): Promise<PostNode[]> {
  return fetchAllPosts(category);
}

export async function getPostData(slug: string): Promise<PostNode | null> {
  try {
    const { data } = await fetchGraphQL(GET_POST, { slug });
    return data.post || null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

export async function exportAllPostsAsJson(category: string | null = null): Promise<void> {
  try {
    console.log('Fetching all posts...');
    const allPosts = await getAllPosts(category);

    const exportPosts: PostExport[] = allPosts.map(post => ({
      ...post,
    }));

    const jsonContent = JSON.stringify(exportPosts, null, 2);

    const fileName = `wp-posts-export-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = path.join(process.cwd(), fileName);

    fs.writeFileSync(filePath, jsonContent);

    console.log(`Exported ${exportPosts.length} posts to ${fileName}`);
    console.log(`File saved at: ${filePath}`);
  } catch (error) {
    console.error('Error exporting posts:', error);
  }
}