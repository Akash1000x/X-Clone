import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";

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
    tweets: (parent: User) => {
      return prismaClient.tweet.findMany({
        where: { author: { id: parent.id } },
        orderBy: { createdAt: "desc" },
      });
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
    recommendedUser: async (parent: User) => {
      const myFollowings = await prismaClient.follows.findMany({
        where: { followerId: parent.id },
        include: {
          following: {
            include: { followers: { include: { following: true } } },
          },
        },
      });

      const recommendedUsers:User[] = []

      
      for(const followings of myFollowings){
        for(const followingOfFollowedUser of followings.following.followers){
          
          if(myFollowings.findIndex((el) => el.followingId === followingOfFollowedUser.following.id) < 0 ){
            recommendedUsers.push(followingOfFollowedUser.following);
          }
        }
      }
      
      if(recommendedUsers.length <= 0){
        const data = await prismaClient.user.findMany({orderBy:{createdAt:"asc"}});
        data.map((e) => recommendedUsers.push(e));
      }
     
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
    return true;
  },

  unfollowUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    await UserService.unFollowUser(ctx.user.id, to);
    return true;
  },
};

export const resolvers = { queries, extraResolvers, mutations };
