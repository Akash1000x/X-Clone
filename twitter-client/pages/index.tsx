import Image from "next/image";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { Inter } from "next/font/google";
import { BsTwitterX } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import { PiBookmarkSimple } from "react-icons/pi";
import { CgMoreO } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import FeedCard from "@/Components/FeedCard";
import { useCallback, useState ,useEffect} from "react";
import toast from "react-hot-toast";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { graphqlClient } from "@/clients/api";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { TfiMoreAlt } from "react-icons/tfi";
import { RiImage2Line } from "react-icons/ri";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";

const inter = Inter({ subsets: ["latin"] });

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const SidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <GoHome />,
  },
  {
    title: "Explore",
    icon: <FiSearch />,
  },
  {
    title: "Notification",
    icon: <IoIosNotificationsOutline />,
  },
  {
    title: "Message",
    icon: <HiOutlineMail />,
  },
  {
    title: "Bookmark",
    icon: <PiBookmarkSimple />,
  },
  {
    title: "Profile",
    icon: <FaRegUser />,
  },
  {
    title: "More",
    icon: <CgMoreO />,
  },
];

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();
  const {mutate} = useCreateTweet(); 

  const queryClient = useQueryClient();

  const [content,setContent] = useState('');

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
  }, []);

  const handleCreateTweet = useCallback(() => {
    mutate({
      content
    });
    setContent('');
  },[content])

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error("Google token not foune");

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("verified Successfully");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken)
        window.localStorage.setItem("_X_token", verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    [queryClient]
  );

  const rows = content.split('\n').length;

  useEffect(() => {
    const textarea = document.getElementById('myTextarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [content]);

  return (
    <div className="font-[chirp-regular]">
      <div className="grid grid-cols-12 h-screen w-screen overflow-y-scroll ">
        <div className="col-span-3 pt-1 h-screen pr-10 ml-12 relative">
          <div className="text-3xl hover:bg-zinc-900 cursor-pointer w-fit p-3 ml-3 mb-4 rounded-full transition-all duration-75">
            <BsTwitterX />
          </div>
          <div className="pl-2">
            <ul>
              {SidebarMenuItems.map((item) => (
                <li
                  className="flex font-[chirp-regular]  hover:bg-zinc-900 cursor-pointer w-fit rounded-full pr-16 pl-3 py-3 transition-all duration-75"
                  key={item.title}
                >
                  <span className="text-3xl pr-4">{item.icon}</span>
                  <span className="text-xl text-gray-200">{item.title}</span>
                </li>
              ))}
            </ul>
            <button className="bg-[#1A8CD8] font-[chirp-bold] text-xl mt-3 w-full rounded-full text-center py-3 ">
              Post
            </button>
          </div>
          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center hover:bg-zinc-900 py-2 pl-2 pr-4 rounded-full cursor-pointer">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full "
                  src={user.profileImageURL}
                  alt="user-image"
                  width={50}
                  height={50}
                />
              )}
              <div className="flex gap-2 font-[chirp-heavy]">
                <h3>{user?.firstName}</h3>
                {/* <h3>{user?.lastName}</h3> */}
              </div>
              <div className="text-2xl items-end pl-7 ">
                <TfiMoreAlt />
              </div>
            </div>
          )}
        </div>
        <div className="col-span-5 border-l-[1px] border-r-[1px] border-zinc-700 ">
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
                  value = {content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What is happening?!"
                  className="w-full bg-transparent placeholder-opacity-75 px-1 pt-2 placeholder:text-xl  font-medium text-xl border-b-[1px] border-zinc-700 focus:outline-none overflow-hidden resize-none"
                  rows={rows>2 ? rows : 2 }
                ></textarea>
                <div className="mt-2 flex justify-between">
                  <RiImage2Line
                    className="text-xl cursor-pointer text-[#1D9BF0]"
                    onClick={handleSelectImage}
                  />
                  <button onClick={handleCreateTweet} className="bg-[#1A8CD8] font-[chirp-bold] text-base rounded-full text-center py-[6px] px-4">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet) =>  tweet && (
            <FeedCard key={tweet?.id} data={tweet as Tweet} />
          )
          )}
        </div>
        <div className="col-span-3 p-5 ">
          {!user && (
            <div className="p-5 bg-zinc-900 rounded-lg">
              <h1 className="text-xl pb-2 font-[chirp-bold] tracking-wider ">
                New to X?
              </h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
