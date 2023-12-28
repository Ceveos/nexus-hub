/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GithubLoginButton from "./github-login-button";
import DiscordLoginButton from "./discord-login-button";

export default function LoginButtons() {
  const [disabled, setDisabled] = useState(false);

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <>
      <GithubLoginButton disabled={disabled} setDisabled={setDisabled} />
      <DiscordLoginButton disabled={disabled} setDisabled={setDisabled} />
    </>
  );
}
