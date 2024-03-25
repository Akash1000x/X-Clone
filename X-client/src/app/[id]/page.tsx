import React from "react";
import GetuserById from "@/components/GetuserById";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { User } from "@/gql/graphql";

const getUserById = async (context: any) => {
  const id = context.params?.id as string | undefined;
  if (!id) return { notFound: true, props: { user: undefined } };
  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });
  if (!userInfo?.getUserById) return { notFound: true };
  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

const UserProfilePage = async (context: any) => {
  const { props } = await getUserById(context);
  return (
    <div>
      <GetuserById {...props} />
    </div>
  );
};

export default UserProfilePage;
