"use client";

import { trpc } from "@/app/trpc/client";

const PageClient = () => {
  const [data] = trpc.categories.getMany.useSuspenseQuery();
  return <div>PageClient: {JSON.stringify(data)}</div>;
};

export default PageClient;
