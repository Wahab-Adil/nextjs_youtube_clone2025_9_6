"use client";
import { trpc } from "../trpc/client";

export default function Home() {
  const { data } = trpc.hello.useQuery({ text: "wahab" });
  return <div className="pl-3 font-bold ">This is Main {data?.greeting}</div>;
}
