import { graphql } from "@/gql";

export const createTweetMutation = graphql(`
  #graphql
  mutation CreateTweet($payload: CreateTweetData!) {
    createTweet(payload: $payload) {
      id
    }
  }
`);

export const likeATweetMutation = graphql(`
  #graphql
  mutation LikeATweet($tweetId: ID!) {
    likeATweet(tweetId: $tweetId)
  }
`);
