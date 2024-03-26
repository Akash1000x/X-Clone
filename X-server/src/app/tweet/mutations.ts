export const mutations = `#graphql 
    createTweet(payload: CreateTweetData!): Tweet

    likeATweet(tweetId:ID!): Boolean
`;
