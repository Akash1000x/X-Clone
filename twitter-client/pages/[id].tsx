import Image from "next/image";

import XLayout from "@/Components/Layout/XLayout";
import { useCurrentUser } from "@/hooks/user";
import type { GetServerSideProps, NextPage } from "next";
import { GoArrowLeft } from "react-icons/go";
import FeedCard from "@/Components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";

interface ServerProps {
  userInfo?:User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  // const { user } = useCurrentUser();


  return (
    <div>
      <XLayout>
        <div className="flex p-2 gap-5">
          <nav className=" p-2 hover:bg-zinc-900 cursor-pointer rounded-full w-fit h-fit">
            <GoArrowLeft className="text-2xl " />
          </nav>
          <div>
            <h1 className="text-xl font-bold">Akash Kumar Kumawat</h1>
            <h1 className="opacity-75">{props?.userInfo?.tweets?.length} posts</h1>
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
        </div>
        <div>
          {props?.userInfo?.tweets?.map((tweet) => <FeedCard key={tweet?.id} data={tweet as Tweet}  />)}
        </div>
      </XLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>{
  const id = context.query.id as string | undefined;

  if(!id) return {notFound:true,props: {user:undefined}}

  const userInfo = await graphqlClient.request(getUserByIdQuery,{id})

  if(!userInfo?.getUserById) return {notFound:true}

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  }
  
}

export default UserProfilePage;
