import React, { useCallback, useMemo } from "react";

import Image from "next/image";

import XLayout from "@/Components/Layout/XLayout";
import type { GetServerSideProps, NextPage } from "next";
import { GoArrowLeft } from "react-icons/go";
import FeedCard from "@/Components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";

interface ServerProps {
  userInfo?: User;
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  
  const amIFollowing = useMemo(() => {
    if (!props?.userInfo) return false;
    return (
      (currentUser?.following?.findIndex(
        (el) => el?.id === props?.userInfo?.id
      ) ?? -1) >= 0
    );
  }, [props?.userInfo,currentUser?.following]);



  const handleFollowUser = useCallback( async ()=>{
    if(!props?.userInfo?.id) return;
    
    await graphqlClient.request(followUserMutation,{to:props?.userInfo?.id});
    await queryClient.invalidateQueries({queryKey:["current-user"]});

  },[props?.userInfo?.id,queryClient]);


  const handleUnFollowUser = useCallback(async ()=> {
    if(!props?.userInfo?.id) return;
     
    await graphqlClient.request(unfollowUserMutation,{to:props?.userInfo?.id});
  },[props?.userInfo?.id,queryClient])

  return (
    <div>
      <XLayout>
        <div className="flex p-2 gap-5">
          <nav className=" p-2 hover:bg-zinc-900 cursor-pointer rounded-full w-fit h-fit">
            <GoArrowLeft className="text-2xl " />
          </nav>
          <div>
            <h1 className="text-xl font-bold">
              {props?.userInfo?.firstName} {props?.userInfo?.lastName}
            </h1>
            <h1 className="opacity-75">
              {props?.userInfo?.tweets?.length} posts
            </h1>
          </div>
        </div>
        <div className="p-4 border-b-[1px] border-zinc-700">
          {props?.userInfo?.profileImageURL && (
            <Image
              className="rounded-full"
              src={props?.userInfo?.profileImageURL}
              alt="user-image"
              width={120}
              height={120}
            />
          )}
          <h1>
            {props?.userInfo?.firstName} {props?.userInfo?.lastName}
          </h1>
          <div className="flex justify-between items-center">
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
            {props?.userInfo?.id !== currentUser?.id && (
              <>
                {amIFollowing ? (
                  <button onClick={handleUnFollowUser} className="bg-white text-black rounded-full px-4 py-2 border-[1px] font-semibold hover:bg-transparent hover:border-[1px] hover:border-red-800 hover:text-red-700 cursor-pointer transition-all duration-200 ">
                    Unfollow
                  </button>
                ) : (
                  <button onClick={handleFollowUser} className="bg-white text-black rounded-full px-4 py-2 font-semibold hover:bg-slate-200 cursor-pointer transition-all duration-200">
                    Follow
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          {props?.userInfo?.tweets?.map((tweet) => (
            <FeedCard key={tweet?.id} data={tweet as Tweet} />
          ))}
        </div>
      </XLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as string | undefined;

  if (!id) return { notFound: true, props: { user: undefined } };

  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default UserProfilePage;
