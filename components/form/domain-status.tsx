"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useDomainStatus } from "./use-domain-status";
import LoadingCircle from "../icons/loading-circle";

export default function DomainStatus({ domain }: { domain: string }) {
  const { status, loading } = useDomainStatus({ domain });

  return (
    loading ? (
      <LoadingCircle dimensions="h-5 w-5" />
    ) : status === "Valid Configuration" ? (
      <CheckCircle2
        fill="#2563EB"
        stroke="currentColor"
        className="text-white  h-5 w-5"
      />
    ) : status === "Pending Verification" ? (
      <AlertCircle
        fill="#FBBF24"
        stroke="currentColor"
        className="text-white  h-5 w-5"
      />
    ) : (
      <XCircle
        fill="#DC2626"
        stroke="currentColor"
        className="text-white  h-5 w-5"
      />
    )
  )
}
