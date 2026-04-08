"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";

interface Application {
  id: string;
  name: string;
  email: string;
  website_url: string | null;
  platform: string | null;
  audience_size: string | null;
  promotion_plan: string | null;
  previous_experience: boolean;
  status: string;
  created_at: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/affiliates/applications?status=${filter}`)
      .then((r) => r.json())
      .then((d) => setApplications(d.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  async function handleAction(appId: string, action: "approve" | "reject") {
    setProcessing(appId);
    try {
      const res = await fetch("/api/admin/affiliates/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, action }),
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== appId));
      }
    } catch {
      // handled
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div>
      <Link
        href="/admin/affiliates"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Affiliates
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">
          Affiliate Applications
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#6B7280]" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-12 text-center">
          <p className="text-sm text-[#6B7280]">
            No {filter} applications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-[#F0F0F0] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-[#111111]">
                      {app.name}
                    </h3>
                    <span className="text-xs text-[#6B7280]">
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-3">{app.email}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[#6B7280]">Platform:</span>{" "}
                      <span className="text-[#111111] font-medium">
                        {app.platform || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Audience:</span>{" "}
                      <span className="text-[#111111] font-medium">
                        {app.audience_size || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Experience:</span>{" "}
                      <span className="text-[#111111] font-medium">
                        {app.previous_experience ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Website:</span>{" "}
                      {app.website_url ? (
                        <a
                          href={app.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] font-medium hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-[#111111] font-medium">N/A</span>
                      )}
                    </div>
                  </div>

                  {app.promotion_plan && (
                    <div className="mt-3 bg-[#FAFAFA] rounded-lg p-3">
                      <p className="text-xs font-semibold text-[#6B7280] mb-1">
                        Promotion Plan
                      </p>
                      <p className="text-sm text-[#111111]">
                        {app.promotion_plan}
                      </p>
                    </div>
                  )}
                </div>

                {filter === "pending" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleAction(app.id, "approve")}
                      disabled={processing === app.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 text-green-700 px-4 py-2 text-sm font-medium hover:bg-green-100 disabled:opacity-50 transition-colors"
                    >
                      {processing === app.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(app.id, "reject")}
                      disabled={processing === app.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
