"use client";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";

import Image1 from '@/public/user1.png'
import Image2 from '@/public/user2.png'
import Image3 from '@/public/user3.png'

const people = [
  {
    id: 1,
    name: "user",
    designation: "Software Engineer",
    image: Image1  
  },
  {
    id: 2,
    name: "user2",
    designation: "Product Manager",
    image: Image2  },
  {
    id: 3,
    name: "user3",
    designation: "",
    image: Image3,
  },
 
 
];

export function AnimatedTooltipPreview({tip} : {tip : boolean}) {
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <AnimatedTooltip items={people} tip={tip} />
    </div>
  );
}
