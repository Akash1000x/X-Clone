"use client";

import FeedCard from "@/components/FeedCard";
import XLayout from "@/components/XLayout";
import { Tweet, User } from "@/gql/graphql";
import {useGetAllTweets } from "@/hooks/tweets";
import { useCurrentUser } from "@/hooks/user";
import PostCreate from "@/components/PostCreate";

interface HomeProps {
  tweets?: Tweet[];
}

const Home: React.FC<HomeProps> = (props) => {
  const { user } = useCurrentUser();
  const { tweets = props.tweets } = useGetAllTweets();

  return (
    <main className="box-border">
      <XLayout>
        <PostCreate user={user as User} />
        {tweets?.map(
          (tweet) =>
            tweet && (
              <FeedCard
                key={tweet?.id}
                data={tweet as Tweet}
                currentUserId={user?.id || ""}
              />
            )
        )}
      </XLayout>
    </main>
  );
};



export default Home;
