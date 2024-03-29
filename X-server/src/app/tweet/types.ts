export const types = `#graphql

    input CreateTweetData{
        content: String!
        imageURL: String
    }

    type Tweet {
        id: ID!
        content: String!
        imageURL: String

        author: User

        likes: [Likes]
    }

    type Likes{
        id: ID!
        tweetId:String
        authorId:String
    }
`;
