"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import LoginButtons from "./login-buttons";
import LogoIcon from "~/nextjs/public/logo.svg";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@nextjs/lib/utils";
import { XCircleIcon } from "@heroicons/react/20/solid";

export default function LoginPage() {
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorMessage = Array.isArray(error) ? error.pop() : error;

    switch (errorMessage) {
      case "OAuthAccountNotLinked":
        setErrorMessage("Another account already exists with this email. Please use the original login method for that account.");
        break;
      case "OAuthCallbackError":
        setErrorMessage("An error occurred while logging in.");
        break;
      case "OAuthCreateAccountError":
        setErrorMessage("An error occurred while creating your account.");
        break;
    }

    typeof errorMessage === 'string' && toast.error(errorMessage);
  }, [error]);

  return (
    <>
    <div className={
      cn(error ? "border border-red-500 dark:border-red-700" : "border-stone-200 dark:border-stone-700",
        "mx-5 border py-10  sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md"
      )}>
      <Image
        alt="Nexus Hub"
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full"
        src={LogoIcon}
      />
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        Nexus Hub
      </h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
        Login Page
      </p>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <LoginButtons />
        </Suspense>
      </div>
    </div>
    
    {errorMessage && (
        <div className="mx-5 border sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md mt-4 border-red-400 dark:border-red-700 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
