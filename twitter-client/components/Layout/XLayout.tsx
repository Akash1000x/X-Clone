import React, { useCallback, useMemo } from "react";

import Image from "next/image";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { BsTwitterX } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import { PiBookmarkSimple } from "react-icons/pi";
import { CgMoreO } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { TfiMoreAlt } from "react-icons/tfi";

import toast from "react-hot-toast";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { graphqlClient } from "@/clients/api";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface XLayoutProps {
  children: React.ReactNode;
}

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const XLayout: React.FC<XLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const SidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <GoHome />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <FiSearch />,
        link: "/",
      },
      {
        title: "Notification",
        icon: <IoIosNotificationsOutline />,
        link: "/",
      },
      {
        title: "Message",
        icon: <HiOutlineMail />,
        link: "/",
      },
      {
        title: "Bookmark",
        icon: <PiBookmarkSimple />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <FaRegUser />,
        link: `/${user?.id}`,
      },
      {
        title: "More",
        icon: <CgMoreO />,
        link: "/",
      },
    ],
    [user?.id]
  );

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

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen overflow-y-scroll ">
        <div className="col-span-2 lg:col-span-3 pt-1 h-screen pr-2 lg:pr-10 lg:ml-12 pl-2 relative flex justify-end">
          <div>
            <div className="text-[28px] hover:bg-zinc-900 cursor-pointer w-fit p-3 mb-1 rounded-full transition-all duration-75">
              <BsTwitterX />
            </div>
            <div className="">
              <ul>
                {SidebarMenuItems.map((item) => (
                  <li
                    
                    key={item.title}
                  >
                    <Link href={item.link} className="flex font-[chirp-regular]  hover:bg-zinc-900 cursor-pointer w-fit rounded-full  pl-3 pr-3 lg:pr-7 py-3 transition-all duration-75">
                      <span className="text-3xl lg:pr-4">{item.icon}</span>
                      <span className="text-xl text-gray-200 hidden lg:inline">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button className="lg:block hidden bg-[#1A8CD8] font-[chirp-bold] text-xl mt-3 w-full rounded-full text-center py-3 ">
                Post
              </button>
              <button className="lg:hidden block bg-[#1A8CD8] mt-3  rounded-full p-3">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp w-8 h-8 text-white"
                  fill="#fff"
                >
                  <g>
                    <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center hover:bg-zinc-900 lg:py-2 lg:pl-2 lg:pr-4 rounded-full cursor-pointer">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full "
                  src={user.profileImageURL}
                  alt="user-image"
                  width={50}
                  height={50}
                />
              )}
              <div className="font-[chirp-heavy] hidden lg:inline">
                <h3>{user?.firstName}</h3>
                {/* <h3>{user?.lastName}</h3> */}
              </div>
              <div className="text-2xl items-end pl-7 hidden lg:inline">
                <TfiMoreAlt />
              </div>
            </div>
          )}
        </div>
        <div className="col-span-10 md:col-span-8 lg:col-span-5 border-l-[1px] border-r-[1px] border-zinc-700 ">
          {props.children}
        </div>
        <div className="col-span-0 md:col-span-3 p-5 ">
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
};

export default XLayout;
