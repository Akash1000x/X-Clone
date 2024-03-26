import { graphql } from "@/gql";

export const GetAllTweetsQuery = graphql(`
  #graphql
  query GetAllTweets {
    getAllTweets {
      id
      content
      imageURL
      author {
        id
        firstName
        lastName
        profileImageURL
      }
      likes {
        id
        authorId
        tweetId
      }
    }
  }
`);

export const getSignedURLForTweetQuery = graphql(`
  #graphql
  query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
  }
`);
