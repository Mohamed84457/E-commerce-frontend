"use client"
// components
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  // route
  const route= useRouter();
  useEffect(()=>{
    setTimeout(() => {
      route.push("/website")
    }, 200);
  },[])
  return (
    <div style={{ height: "100vh" }}>
    loading...
    </div>
  );
}
