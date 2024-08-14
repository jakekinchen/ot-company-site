// src/queries.ts

export const GET_POST = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      date
      slug
      author {
        node {
          name
        }
      }
      content
      excerpt
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
    }
  }
`;