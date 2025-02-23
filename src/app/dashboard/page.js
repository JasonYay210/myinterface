'use client'

import Hero from "@/components/Hero";
import Standardize from "@/components/Standardize";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function DashboardPage() {
  // State to keep track of the buttons
  const [buttons, setButtons] = useState([]);
  const router = useRouter(); // Initialize useRouter

  // Function to add a new button
  const addButton = () => {
    const newButtonName = prompt("Enter the name for the new button:");  // Ask the user for a name
    if (newButtonName) {  // Only add if the user entered a name
      setButtons([...buttons, newButtonName]); // Adds the new button name to the array
    }
  };

  // Function to handle the click of a new button
  const handleButtonClick = (buttonName) => {
    // Redirect to the mockup-creation page (you can pass any dynamic part if necessary)
    router.push('dashboard/mockup-creation');
  };

  return (
    <div>
      <div className="flex">
        <div className="w-[30%] border-r border-[1px] p-[25px] gap-[15px]">
          <h1 className="font-space-mono font-normal text-[21px] leading-[31.1px] tracking-normal">Browse</h1>
          {/* Render the dynamically generated clickable divs */}
          {buttons.map((button, index) => (
            <div 
              key={index} 
              onClick={() => handleButtonClick(button)}  // Add onClick to navigate
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
