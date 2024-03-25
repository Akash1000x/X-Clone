import { graphqlClient } from "@/clients/api";
import Tweets from "@/components/Tweets";
import { Tweet } from "@/gql/graphql";
import { GetAllTweetsQuery } from "@/graphql/query/tweets";

async function getAllTweets() {
  const allTweets = await graphqlClient.request(GetAllTweetsQuery);
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
}

export default async function Home() {
  const { props } = await getAllTweets();

  return (
    <main>
      <Tweets {...props} />
    </main>
  );
}
