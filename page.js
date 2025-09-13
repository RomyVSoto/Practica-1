"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import TaskCard from "./components/TaskCard";
import Loading from "./components/Loading";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  if (status === "loading") return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl font-bold text-blue-500 mb-6 text-center">
        Your Tasks
      </h1>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">
          No tasks yet. Click "New" to add one!
        </p>
      ) : (
        tasks.map((task) => <TaskCard task={task} key={task._id} />)
      )}
    </div>
  );
}
