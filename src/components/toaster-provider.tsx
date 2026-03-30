"use client";

import { Toaster } from "sileo";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      offset={{ top: 24 }}
      theme="light"
      options={{
        roundness: 16,
      }}
    />
  );
}
