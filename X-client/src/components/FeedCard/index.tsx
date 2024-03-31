import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { LuUpload } from "react-icons/lu";
import { PiBookmarkSimple } from "react-icons/pi";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";
import { SiSimpleanalytics } from "react-icons/si";
import { graphqlClient } from "@/clients/api";
import { likeATweetMutation } from "@/graphql/mutation/tweets";

interface FeedCardProps {
  data: Tweet;
  currentUserId: string;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const data = props.data;


  return (
    <div>
      <div className="grid grid-cols-12 border-b-[1px] border-zinc-700 pt-2 pb-1 px-4 hover:bg-neutral-950 transition-all duration-150 cursor-pointer">
        <div className="col-span-1 ">
          {data?.author?.profileImageURL && (
            <Link href={`/${data?.author?.id}`}>
              <Image
                className="rounded-full"
                src={data?.author?.profileImageURL}
                alt="user-image"
                width={50}
                height={50}
              />
            </Link>
          )}
        </div>
        <div className="col-span-11 pl-2 ">
          <h5 className="text-base hover:underline font-bold">
            <Link href={`/${data?.author?.id}`}>
              {data?.author?.firstName} {data?.author?.lastName}
            </Link>
          </h5>
          <p className="text-justify text-sm font-medium tracking-wider py-1">
            {data?.content}
            {data?.imageURL && (
              <Image
                className="rounded-2xl mt-2 border-[1px] border-zinc-700 w-auto h-auto"
                src={data?.imageURL}
                alt="tweet-image"
                width={300}
                height={300}
              />
            )}
          </p>

          <div className="postButtons flex text-xl mt-3 justify-between items-center text-zinc-500">
            <div className="p-2">
              <BiMessageRounded />
            </div>
            <div className="p-2">
              <AiOutlineRetweet />
            </div>
              
            <HandleLikeATweet data={data} currentUserId={props.currentUserId}/>

            <div className="p-[11px]">
              <SiSimpleanalytics className="w-[14px] h-[14px]" />
            </div>
            <div className="flex">
              <div className="p-2">
                <PiBookmarkSimple />
              </div>
              <div className="p-2">
                <LuUpload />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const HandleLikeATweet: React.FC<{ data: Tweet; currentUserId: string }> = ({ data, currentUserId }) => {

  const [likeEffect, setlikeEffect] = useState(false);
  const [likesCount, setLikesCount] = useState(data.likes?.length || 0);

  const handleLikes = useCallback(async () => {
    await graphqlClient.request(likeATweetMutation, { tweetId: data?.id });
    if (likeEffect) {
      setlikeEffect(false);
      setLikesCount(likesCount - 1);
    } else {
      setlikeEffect(true);
      setLikesCount(likesCount + 1);
    }
  }, [data?.id, likeEffect, likesCount]);

  useEffect(() => {

    data?.likes?.map((e) => {
      if (e?.authorId === currentUserId) {
        setlikeEffect(true);
      }
    });
  }, [currentUserId, data.likes]);

  return (
    <div
      onClick={handleLikes}
      className=" p-2 transition-all duration-200 flex items-center hover:text-pink-700 hover:bg-pink-950  hover:bg-opacity-40 rounded-full relative"
    >
      <div className="flex">
        {likeEffect ? (
          <div className="w-5 h-5 heart">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="rgb(190 24 93)"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
            >
              <g>
                <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
              </g>
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 heart">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="rgb(113 113 122)"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi "
            >
              <g>
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
              </g>
            </svg>
          </div>
        )}
      </div>
      <span className="text-sm font-thin mt-1 -ml-1 absolute -right-1 top-[5px] ">
        {likesCount}
      </span>
    </div>
  );
}


export default FeedCard;