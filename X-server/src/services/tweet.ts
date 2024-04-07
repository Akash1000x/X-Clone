import { prismaClient } from "../clients/db";
import { redisClient } from "../clients/redis";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  authorId: string;
}

class TweetService {
  public static async createNewTweet(payload: CreateTweetPayload) {
    //applying rate limiting
    // const rateLimitigFlag = await redisClient.get(
    //   `RATE_LIMIT:TWEET:${payload.authorId}`
    // );
    // if (rateLimitigFlag)
    //   throw new Error("Please wait 10 seconds before creating a new tweet");

    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: payload.authorId } },
      },
    });
    // await redisClient.setex(`RATE_LIMIT:TWEET:${payload.authorId}`, 10, 1);
    await redisClient.del(`ALL_TWEETS`);
    await redisClient.del(`USER_TWEETS:${payload.authorId}`);
    return tweet;
  }

  public static async getAllTweets() {
    const cachedtweets = await redisClient.get(`ALL_TWEETS`);
    if (cachedtweets) return JSON.parse(cachedtweets);

    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
    // caching the result in redis for better performance
    await redisClient.set(`ALL_TWEETS`, JSON.stringify(tweets));
    return tweets;
  }

  public static async getUserTweets(id: string) {
    const cachedUserTweets = await redisClient.get(`USER_TWEETS:${id}`);
    if (cachedUserTweets) return JSON.parse(cachedUserTweets);

    const userTweets = await prismaClient.tweet.findMany({
      where: { author: { id } },
      orderBy: { createdAt: "desc" },
      include: { likes: true },
    });

    await redisClient.set(`USER_TWEETS:${id}`, JSON.stringify(userTweets));
    return userTweets;
  }
}

export default TweetService;
