import React from "react";
import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { RiHeart3Line } from "react-icons/ri";
import { AiOutlineRetweet } from "react-icons/ai";
import { LuUpload } from "react-icons/lu";
import { PiBookmarkSimple } from "react-icons/pi";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;
  return (
    <div>
      <div className="grid grid-cols-12 border-b-[1px] border-zinc-700 py-3 px-4 hover:bg-neutral-950 transition-all duration-150 cursor-pointer">
        <div className="col-span-1 ">
          {data?.author?.profileImageURL && (
            <Link href={`/${data?.author?.id}`}>
              <Image
                className="rounded-full"
                src={data.author?.profileImageURL}
                alt="user-image"
                width={50}
                height={50}
              />
            </Link>
          )}
        </div>
        <div className="col-span-11 pl-2 ">
          <h5 className="font-[chirp-bold] text-lg hover:underline ">
            <Link href={`/${data?.author?.id}`}>
              {data?.author?.firstName} {data?.author?.lastName}
            </Link>
          </h5>
          <p className="text-justify opacity-95 font-[chirp-regular] text-sm font-thin">
            {data?.content}
          </p>

          <div className="flex justify-between text-xl pt-3">
            <BiMessageRounded />
            <AiOutlineRetweet />
            <RiHeart3Line />
            <PiBookmarkSimple />
            <LuUpload />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;