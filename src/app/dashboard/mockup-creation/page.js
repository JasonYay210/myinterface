'use client'

import React, { useState } from 'react';
import MockupCreation from "@/components/MockupCreation";
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function MockupCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonName = searchParams.get('name'); // Get the button name from URL

  // State to manage the generated code (this would normally come from MockupCreation component)
  const [generatedCode, setGeneratedCode] = useState(''); // Assuming MockupCreation sets this

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

        {/* Mockup Creation Component */}
        <MockupCreation setGeneratedCode={setGeneratedCode} /> {/* Pass down setGeneratedCode */}
      </div>

      {/* Right Side: Display Generated Code as Webpage */}
      <div className="ml-8 w-1/3 p-4 bg-gray-100 rounded-md">
        <h2 className="text-xl font-bold">Generated Code Preview</h2>

        {/* Render the generated code as a webpage using iframe */}
        {generatedCode && renderCodeAsWebpage()}
      </div>
    </div>
  );
}
