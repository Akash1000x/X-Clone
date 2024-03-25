"use client";

import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import XLayout from "@/components/XLayout";
import { Tweet } from "@/gql/graphql";
import { getSignedURLForTweetQuery } from "@/graphql/query/tweets";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweets";
import { useCurrentUser } from "@/hooks/user";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiImage2Line } from "react-icons/ri";

interface HomeProps {
  tweets?: Tweet[];
}

const Home: React.FC<HomeProps> = (props) => {
  const { user } = useCurrentUser();
  const { mutate } = useCreateTweet();
  const { tweets = props.tweets } = useGetAllTweets();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const filelist = input.files;
      const file: File | null | undefined = filelist?.[0];

      if (!file) return;

      const { getSignedURLForTweet } = await graphqlClient.request(
        getSignedURLForTweetQuery,
        {
          imageName: file.name,
          imageType: file.type,
        }
      );

      if (getSignedURLForTweet) {
        toast.loading("Uploading Image", { id: "2" });
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            "Content-Type": file?.type,
          },
        });
        toast.success("Image Uploaded", { id: "2" });
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}/${url.pathname}`;
        setImageURL(myFilePath);
      }
    };
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    const handleFn = handleInputChangeFile(input);
    input.addEventListener("change", handleFn);
    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(() => {
    mutate({ content, imageURL });
    setContent("");
    setImageURL("");
  }, [content, imageURL,mutate]);

  const rows = content.split("\n").length;

  useEffect(() => {
    const textarea = document.getElementById("myTextarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [content]);

  return (
    // <main className="flex min-h-screen flex-col items-center justify-between">
    <main className="font-[chirp-regular] box-border">
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
              {imageURL && (
                <Image
                  src={imageURL}
                  alt="tweet-image"
                  width={300}
                  height={300}
                />
              )}
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
        {tweets?.map(
          (tweet) =>
            tweet && <FeedCard key={tweet?.id} data={tweet as Tweet} />
        )}
      </XLayout>
    </main>
  );
};

export default Home;
