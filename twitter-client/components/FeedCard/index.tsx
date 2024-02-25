import React from "react";
import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { RiHeart3Line } from "react-icons/ri";
import { AiOutlineRetweet } from "react-icons/ai";
import { LuUpload } from "react-icons/lu";
import { PiBookmarkSimple } from "react-icons/pi";

const FeedCard: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-12 border-b-[1px] border-zinc-700 py-3 px-5 hover:bg-neutral-950 transition-all duration-150 cursor-pointer">
        <div className="col-span-1 ">
          <Image
            src={
              "https://avatars.githubusercontent.com/u/113286019?s=400&u=13265d2f496bd6022effd043e8125620d407f19f&v=4"
            }
            alt="user-image"
            width={50}
            height={50}
          />
        </div>
        <div className="col-span-11 pl-2 ">
          <h5 className="font-[chirp-bold] text-lg">Akash kumar kumawat</h5>
          <p className="text-justify opacity-95">
            Given that the Gemini AI will be at the heart of every Google
            product and YouTube,
            <br /> <br /> this is extremely alarming! The senior Google exec called
            <br /> me again yesterday and said it would take a few months to
            fix. Previously, he thought it would be faster.
          </p>

          <div className="flex justify-between text-xl pt-3" >
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
