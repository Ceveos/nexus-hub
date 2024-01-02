/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";

type Props = {
  icon: JSX.Element;
  providerId: string;
  providerName: string;
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>
};

export default function LoginButton({icon, providerId, providerName, disabled, setDisabled}: Props) {
  
  const [loading, setLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || undefined;

  return (
    <button
      disabled={disabled}
      onClick={() => {
        setDisabled(true);
        setLoading(true);
        void signIn(providerId, { callbackUrl });
      }}
      className={`${
        loading
          ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
          : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    >
      {loading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        <>
          {icon}
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Login with {providerName}
          </p>
        </>
      )}
    </button>
  );
}
