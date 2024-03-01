import Image from "next/image";

import { Inter } from "next/font/google";

import FeedCard from "@/Components/FeedCard";
import { useCallback, useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/user";
import { RiImage2Line } from "react-icons/ri";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import XLayout from "@/Components/Layout/XLayout";
import { GetAllTweetsQuery } from "@/graphql/query/tweet";
import { graphqlClient } from "@/clients/api";
import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {


  const { user } = useCurrentUser();
  // const { tweets = [] } = useGetAllTweets();
  const { mutate } = useCreateTweet();


  const [content, setContent] = useState("");

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
  }, []);

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    });
    setContent("");
  }, [content]);

  const rows = content.split("\n").length;

  useEffect(() => {
    const textarea = document.getElementById("myTextarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [content]);

  return (
    <div className="font-[chirp-regular]">
      <XLayout>
        <div>
          <div className="grid grid-cols-12 border-b-[1px] border-zinc-700 py-3 px-4 hover:bg-neutral-950 transition-all duration-150 ">
            <div className="col-span-1 ">
              {user?.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-image"
                  width={50}
                  height={50}
                />
              )}
            </div>
            <div className="col-span-11 pl-2 ">
              <textarea
                id="myTextarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What is happening?!"
                className="w-full bg-transparent placeholder-opacity-75 px-1 pt-2 placeholder:text-xl  font-medium text-xl border-b-[1px] border-zinc-700 focus:outline-none overflow-hidden resize-none"
                rows={rows > 2 ? rows : 2}
              ></textarea>
              
              <div className="mt-2 flex justify-between">
                <RiImage2Line
                  className="text-xl cursor-pointer text-[#1D9BF0]"
                  onClick={handleSelectImage}
                />
                <button
                  onClick={handleCreateTweet}
                  className="bg-[#1A8CD8] font-[chirp-bold] text-base rounded-full text-center py-[6px] px-4"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
        {props?.tweets?.map(
          (tweet) => tweet && <FeedCard key={tweet?.id} data={tweet as Tweet} />
        )}
      </XLayout>
    </div>
  );
}


export const getServerSideProps:GetServerSideProps<HomeProps> = async ()=> {
  const allTweets = await graphqlClient.request(GetAllTweetsQuery);
  return {
    props:{
      tweets: allTweets.getAllTweets as Tweet[],
    }
  }
}