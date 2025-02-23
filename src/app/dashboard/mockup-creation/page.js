'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import MockupCreation from "@/components/MockupCreation"; // Assuming MockupCreation is responsible for generating mockup code
import Hero from "@/components/MockupCreation"; // Assuming Hero is the component generating elements
import EmptyEle from "@/components/EmptyEle";

export default function MockupCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonName = searchParams.get('name'); // Get the button name from URL

  // State to manage the generated code
  const [generatedCode, setGeneratedCode] = useState(''); 

  // State to hold generated EmptyEle components
  const [generatedElements, setGeneratedElements] = useState([]); 

  // Log the value of generatedCode whenever it changes
  useEffect(() => {
    console.log("Generated Code:", generatedCode); // Log the current value of generatedCode
  }, [generatedCode]); // Runs every time generatedCode is updated

  // Function to render the generated code as a webpage
  const renderCodeAsWebpage = () => {
    return (
      <iframe
        srcDoc={generatedCode}  // Using `srcDoc` to dynamically load HTML code as the webpage content
        title="Generated Code Preview"
        className="w-full h-full"
        style={{ border: 'none' }}
      />
    );
  };

  // Handle adding new elements (e.g., the result from MockupCreation) to generatedElements
  const handleGeneratedElement = (content) => {
    setGeneratedElements((prev) => [...prev, content]);
  };

  return (
    <div className="p-5 flex">
      {/* Left Side: Mockup Creation */}
      <div className="flex-1">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/dashboard')} 
          className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
        >
          ← Back
        </button>

        {/* Display the button name */}
        {buttonName && (
          <h2 className="mt-4 text-xl font-bold">{buttonName}</h2>
        )}

        <h1 className="mt-4">Mockup Creation</h1>
        <p>Welcome to the mockup creation page!</p>

        {/* Pass handleGeneratedElement to Hero as a prop */}
        <Hero onGeneratedElement={handleGeneratedElement} />

        {/* Display generated EmptyEle components */}
        <div>
          {generatedElements.map((content, index) => (
            <EmptyEle key={index} content={content} />
          ))}
        </div>
      </div>
    </div>
  );
}
