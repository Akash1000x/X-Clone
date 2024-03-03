import { prismaClient } from "../clients/db";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  authorId: string;
}

class TweetService {
  public static async createNewTweet(payload: CreateTweetPayload) {
    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: payload.authorId } },
      },
    });
    return tweet;
  }

  public static async getAllTweets() {
    return await prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } });
  }
}

export default TweetService;
