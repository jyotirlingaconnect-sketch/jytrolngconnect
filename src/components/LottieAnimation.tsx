"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

// Lottie JSON files are loosely typed by the library itself
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LottieData = Record<string, any>;

interface LottieAnimationProps {
  path?: string;
  animationData?: LottieData;
  className?: string;
}

export default function LottieAnimation({ path, animationData, className }: LottieAnimationProps) {
  const [data, setData] = useState<LottieData | null>(animationData || null);

  useEffect(() => {
    if (path && !data) {
      fetch(path)
        .then((res) => {
          if (!res.ok) {
            return null;
          }
          return res.json() as Promise<LottieData>;
        })
        .then((json) => {
          if (json) setData(json);
        })
        .catch(() => {
          // Animation failed to load — render nothing gracefully
        });
    }
  }, [path, data]);

  if (!data) {
    return <div className={className} aria-hidden="true" />;
  }

  return <Lottie animationData={data} className={className} />;
}
