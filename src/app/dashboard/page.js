'use client'

import Hero from "@/components/Hero";
import Standardize from "@/components/Standardize";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [buttons, setButtons] = useState([]);
  const router = useRouter();

  const addButton = () => {
    const newButtonName = prompt("Enter the name for the new button:");
    if (newButtonName) {
      setButtons([...buttons, newButtonName]);
    }
  };

  const handleButtonClick = (buttonName) => {
    // Redirect to the mockup page with buttonName as a query parameter
    router.push(`/dashboard/mockup-creation?name=${encodeURIComponent(buttonName)}`);
  };

  return (
    <div>
      <div className="flex">
        <div className="w-[30%] border-r border-[1px] p-[25px] gap-[15px]">
          <h1 className="font-space-mono font-normal text-[21px] leading-[31.1px] tracking-normal">Browse</h1>
          {buttons.map((button, index) => (
            <div 
              key={index} 
              onClick={() => handleButtonClick(button)}
              className="flex flex-col bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
            >
              {button}
            </div>
          ))}
          <div 
            onClick={addButton} 
            className="bg-black text-white px-9 py-4 rounded cursor-pointer flex items-center justify-center"
          >
            +
          </div>
        </div>
        <div className="p-[25px] gap-[25px] flex w-[70%]">
          <Hero />
          <Standardize />
        </div>
      </div>
    </div>
  );
}
