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
import { useCallback } from "react";
import toast from "react-hot-toast";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { graphqlClient } from "@/clients/api";

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

      if(verifyGoogleToken){
        window.localStorage.setItem("_X_token",verifyGoogleToken);
      }
    },
    []
  );

  return (
    <div className="font-[chirp-regular]">
      <div className="grid grid-cols-12 h-screen w-screen overflow-y-scroll ">
        <div className="col-span-3 pt-1 ml-12 relative">
          <div className="fixed">
            <div className="text-3xl hover:bg-zinc-900 cursor-pointer w-fit p-3 ml-3 mb-4 rounded-full transition-all duration-75">
              <BsTwitterX />
            </div>
            <div className="pr-10 pl-2">
              <ul>
                {SidebarMenuItems.map((item) => (
                  <li
                    className="flex font-[chirp-regular]  hover:bg-zinc-900 cursor-pointer w-fit rounded-full pr-8 pl-3 py-3 transition-all duration-75"
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
          </div>
        </div>
        <div className="col-span-5 border-l-[1px] border-r-[1px] border-zinc-700 ">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3 p-5 ">
          <div className="p-5 bg-zinc-900 rounded-lg">
            <h1 className="text-xl pb-2 font-[chirp-bold] tracking-wider ">
              New to X?
            </h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        </div>
      </div>
    </div>
  );
}
