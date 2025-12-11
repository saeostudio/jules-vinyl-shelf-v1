"use client";
import { useEffect, useState } from "react";
import Shelf from "@/components/Shelf";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/auth/me")
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (loading) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">Loading...</div>;
  if (!user) return null;

  return <Shelf user={user} />;
}
