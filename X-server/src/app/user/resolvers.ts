import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";
import { redisClient } from "../../clients/redis";
import TweetService from "../../services/tweet";

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const JWTToken = await UserService.verifyGoogleAuthToken(token);
    return JWTToken;
  },

  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    const id = ctx?.user?.id;
    if (!id) return null;

    const user = await UserService.getUserById(id);
    return user;
  },

  getUserById: async (
    parent: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => UserService.getUserById(id),
};

const extraResolvers = {
  User: {
    tweets:async (parent: User) => {
      return await TweetService.getUserTweets(parent.id);
    },
    followers: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: { followingId: parent.id },
        include: {
          follower: true,
        },
      });
      return result.map((el) => el.follower);
    },
    following: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: { followerId: parent.id },
        include: {
          following: true,
        },
      });
      return result.map((el) => el.following);
    },

    likes:async (parent:User) =>{
      return await prismaClient.likes.findMany({where:{authorId:parent.id}})
    },

    recommendedUser: async (parent: User) => {
      const cachedValue = await redisClient.get(
        `RECOMMENDED_USERS:${parent.id}`
      );
      if (cachedValue) return JSON.parse(cachedValue);
      
      
      const myFollowings = await prismaClient.follows.findMany({
        where: { followerId: parent.id },
        include: {
          following: {
            include: { followers: { include: { following: true } } },
          },
        },
      });
      

      const recommendedUsers: User[] = [];

      //if the user is not following anyone
      if (myFollowings.length <= 0) {
        const users = await prismaClient.user.findMany({
          orderBy: { createdAt: "asc" },
        });

        for (const oneUser of users) {
          if (oneUser.id !== parent.id) {
            recommendedUsers.push(oneUser);
          }
        }
      }


      for (const followings of myFollowings) {
        for (const followingOfFollowedUser of followings.following.followers) {
          if (
            myFollowings.findIndex(
              (el) => el.followingId === followingOfFollowedUser.following.id
            ) < 0
          ) {
            recommendedUsers.push(followingOfFollowedUser.following);
          }
        }
      }

      
      await redisClient.set(
        `RECOMMENDED_USERS:${parent.id}`,
        JSON.stringify(recommendedUsers)
      );

      return recommendedUsers;
    },
  },
};

const mutations = {
  followUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");

    await UserService.followUser(ctx.user.id, to);
    await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
    return true;
  },

  unfollowUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    await UserService.unFollowUser(ctx.user.id, to);
    await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
    return true;
  },
};

export const resolvers = { queries, extraResolvers, mutations };
