import { Tweet } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UserService from "../../services/user";
import TweetService, { CreateTweetPayload } from "../../services/tweet";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:`${process.env.AWS_ACCESS_KEY_ID_}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY_}`,
  },
});

const queries = {
  getAllTweets: () => TweetService.getAllTweets(),

  getSignedURLForTweet: async (
    parent: any,
    { imageName, imageType }: { imageName: string; imageType: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("You are Unauthenticated");

    const allowedImageType = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (!allowedImageType.includes(imageType))
      throw new Error("Invalid Image Type");

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      ContentType: imageType,
      Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}`,
    });

    const signedUrl = await getSignedUrl(s3Client, putObjectCommand);

    return signedUrl;
  },
};

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");

    const tweet = await TweetService.createNewTweet({
      ...payload,
      authorId: ctx.user.id,
    });
    return tweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) => {
      return UserService.getUserById(parent.authotId);
    },
  },
};

export const resolvers = { mutations, extraResolvers, queries };
