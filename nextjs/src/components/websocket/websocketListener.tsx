"use client";

import { useEffect } from "react";
import useWebsocketStore from "./store";


export default function WebsocketListener() {
  const addListener = useWebsocketStore((state) => state.addListener);
  const removeListener = useWebsocketStore((state) => state.removeListener);

  useEffect(() => {
    addListener();
    return () => removeListener();
  }, [addListener, removeListener]);

  return null;
}