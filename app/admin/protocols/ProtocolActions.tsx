"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  protocolId: string;
  active: boolean;
}

export default function ProtocolActions({ protocolId, active }: Props) {
  const router = useRouter();
  const [toggling, setToggling] = useState(false);

  async function toggleActive() {
    setToggling(true);
    try {
      const res = await fetch("/api/admin/protocols/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: protocolId, active: !active }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert("Failed to toggle status");
    } finally {
      setToggling(false);
    }
  }

  return (
    <button
      onClick={toggleActive}
      disabled={toggling}
      className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
        active
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}
