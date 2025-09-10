"use client";

import { trpc } from "@/app/trpc/client";

const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "wahab" });
  return <div>PageClient: {data.greeting}</div>;
};

export default PageClient;
