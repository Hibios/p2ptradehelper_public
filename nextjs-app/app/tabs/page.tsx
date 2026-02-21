"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Tabs() {
  const router = useRouter();

  useEffect(() => {
      router.push(`/tabs/editor`);
    });
  
  return <div></div>;
}
