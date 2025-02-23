'use client'

import React from 'react';
import MockupCreation from "@/components/MockupCreation";
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function MockupCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonName = searchParams.get('name'); // Get the button name from URL

  return (
    <div className="p-5">
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


      <MockupCreation />

    </div>
    
  );
}
