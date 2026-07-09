"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  path?: string;
  animationData?: any;
  className?: string;
}

export default function LottieAnimation({ path, animationData, className }: LottieAnimationProps) {
  const [data, setData] = useState<any>(animationData);

  useEffect(() => {
    if (path && !data) {
      fetch(path)
        .then((res) => {
          if (!res.ok) {
            console.warn(`Lottie file not found at ${path}. Please add it to your public folder.`);
            return null;
          }
          return res.json();
        })
        .then((json) => setData(json))
        .catch((err) => console.error("Error loading lottie animation:", err));
    }
  }, [path, data]);

  if (!data) {
    return <div className={className}></div>;
  }

  return <Lottie animationData={data} className={className} />;
}
