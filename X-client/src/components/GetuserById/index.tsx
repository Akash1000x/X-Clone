"use client";

import React, { useCallback, useEffect} from "react";

import Image from "next/image";

import XLayout from "@/components/XLayout";
import type { NextPage } from "next";
import { GoArrowLeft } from "react-icons/go";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { graphqlClient } from "@/clients/api";
import { useCurrentUser } from "@/hooks/user";
import {
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/user";
import Link from "next/link";

import Xbanner from "@/../public/x-banner.jpg";

interface ServerProps {
  userInfo?: User;
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const { user: currentUser } = useCurrentUser();

  return (
    <div>
      <XLayout>
        <div className="flex p-2 gap-5">
          <Link
            href={"/"}
            className=" p-2 hover:bg-zinc-900 cursor-pointer rounded-full w-fit h-fit"
          >
            <GoArrowLeft className="text-2xl " />
          </Link>
          <div>
            <h1 className="text-xl font-bold">
              {props?.userInfo?.firstName} {props?.userInfo?.lastName}
            </h1>
            <h1 className="opacity-75">
              {props?.userInfo?.tweets?.length} posts
            </h1>
          </div>
        </div>
        <div className="py-4 border-b-[1px] border-zinc-700">
          {props?.userInfo?.profileImageURL && (
            <div className="relative">
              <Image
                className="w-full h-60"
                src={Xbanner}
                alt="user-image"
                width={600}
                height={60}
              />
              <Image
                className="rounded-full absolute -bottom-12 left-7 box-content border-4 border-black"
                src={props?.userInfo?.profileImageURL}
                alt="user-image"
                width={120}
                height={120}
              />
            </div>
          )}
          <h1 className="text-xl font-bold mt-20 px-4">
            {props?.userInfo?.firstName} {props?.userInfo?.lastName}
          </h1>
          <div className="flex justify-between items-center px-4">
            <div className="flex gap-4 mt-4">
              <span className="font-semibold hover:border-b cursor-pointer leading-none">
                {props?.userInfo?.following?.length ?? 0}
                <span className="opacity-45  font-thin"> Following</span>
              </span>
              <span className="font-semibold hover:border-b cursor-pointer leading-none">
                {props?.userInfo?.followers?.length ?? 0}
                <span className="opacity-45 font-thin"> Followers</span>
              </span>
            </div>

            <HandleFollowUnFollow props={props} currentUser={currentUser as User} />
            
          </div>
        </div>
        <div>
          {props?.userInfo?.tweets?.map((tweet) => (
            <FeedCard
              key={tweet?.id}
              data={tweet as Tweet}
              currentUserId={currentUser?.id || ""}
            />
          ))}
        </div>
      </XLayout>
    </div>
  );
};

const HandleFollowUnFollow: React.FC<{
  props: ServerProps;
  currentUser: User ;
}> = ({ props, currentUser }) => {

  const [followingTheUser, setfollowingTheUser] =
    React.useState<boolean>(false);

  useEffect(() => {
    if (!props?.userInfo) return;
    const flag =
      (currentUser?.following?.findIndex(
        (el) => el!.id === props?.userInfo?.id
      ) ?? -1) >= 0;
    setfollowingTheUser(flag);
  }, [props?.userInfo, currentUser?.following, currentUser?.id]);


  const handleFollowUser = useCallback(async () => {
    if (!props?.userInfo?.id) return;

    await graphqlClient.request(followUserMutation, {
      to: props?.userInfo?.id,
    });
    setfollowingTheUser(true);
  }, [props?.userInfo?.id]);



  const handleUnFollowUser = useCallback(async () => {
    if (!props?.userInfo?.id) return;

    await graphqlClient.request(unfollowUserMutation, {
      to: props?.userInfo?.id,
    });
    setfollowingTheUser(false);
  }, [props?.userInfo?.id]);

  return (
    <div>
      {props?.userInfo?.id !== currentUser?.id && (
        <>
            <button
              onClick={followingTheUser? handleUnFollowUser : handleFollowUser}
              className={`bg-white text-black rounded-full px-4 py-1 border-[1px] font-semibold ${followingTheUser ? `hover:bg-transparent hover:border-[1px] hover:border-red-800 hover:text-red-700` : `hover:bg-slate-200`}  cursor-pointer transition-all duration-200 `}
            >
              {followingTheUser ? "Unfollow" : "Follow"}
            </button>
        </>
      )}
    </div>
  );
};
export default UserProfilePage;
