// src/queries.ts
export const GET_POST = `
 query GetPost($slug: ID!) {
   post(id: $slug, idType: SLUG) {
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
   }
 }
`;

export const GET_POST_ITEMS = `
query GetPosts {
    posts(first: 10) {
      nodes {
        id
        title
        date
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

const GET_ALL_POST_SLUGS = `
  query GetAllPostSlugs($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        categories {
          nodes {
            name
          }
        }
      }
    }
  }
`;


export const GET_NEWS_ITEMS = `
 query GetNewsItems {
   posts(first: 10, where: {categoryName: "News"}) {
     nodes {
       id
       title
       date
       slug
       excerpt
       featuredImage {
         node {
           sourceUrl
           altText
         }
       }
       author {
         node {
           name
         }
       }
     }
   }
 }
`;

export const GET_NEWS_POST = `
 query GetNewsPost($slug: ID!) {
   post(id: $slug, idType: SLUG) {
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
     categories(where: {name: "News"}) {
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