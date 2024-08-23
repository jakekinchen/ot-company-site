// src/queries.ts

const POST_FIELDS = `
  id
  title
  content
  excerpt
  date
  slug
  author {
    node {
      name
    }
  }
  categories {
    nodes {
      name
    }
  }
  tags {
    nodes {
      name
    }
  }
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
`;

export const GET_POST = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ${POST_FIELDS}
    }
  }
`;

export const GET_POSTS = `
  query GetPosts($first: Int!, $after: String, $category: String) {
    posts(first: $first, after: $after, where: {categoryName: $category}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;

export const GET_POST_SLUGS = `
  query GetPostSlugs($first: Int!, $after: String, $category: String) {
    posts(first: $first, after: $after, where: {categoryName: $category}) {
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