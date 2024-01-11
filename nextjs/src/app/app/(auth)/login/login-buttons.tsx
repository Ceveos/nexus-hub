/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
// import GithubLoginButton from "./github-login-button";
import DiscordLoginButton from "./discord-login-button";

export default function LoginButtons() {
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      {/* <GithubLoginButton disabled={disabled} setDisabled={setDisabled} /> */}
      <DiscordLoginButton disabled={disabled} setDisabled={setDisabled} />
    </>
  );
}
