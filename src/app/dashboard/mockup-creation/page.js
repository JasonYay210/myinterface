'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Hero from "@/components/MockupCreation"; // Assuming Hero is the component generating elements
import EmptyEle from "@/components/EmptyEle";

export default function MockupCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonName = searchParams.get('name'); // Get the button name from URL

  const [generatedElements, setGeneratedElements] = useState([]); // Track generated elements
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    console.log("Generated Elements:", generatedElements); // Log the generated elements
  }, [generatedElements]);

  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowHero((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleTabKey);

    return () => {
      window.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const handleGeneratedElement = (content) => {
    setGeneratedElements((prev) => [...prev, content]);
  };

  const deleteElement = (index) => {
    const updatedElements = generatedElements.filter((_, i) => i !== index);
    setGeneratedElements(updatedElements);
  };

  return (
    <div className="flex relative">
      <div className="flex-1">
        <div className="p-5">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="cursor-pointer"
          >
            <u>Back</u>
          </button>
          {buttonName && <h2 className="mt-4 text-xl font-bold">{buttonName}</h2>}
        </div>

        <div>
          {generatedElements.map((content, index) => (
            <EmptyEle 
              key={index} 
              content={content} 
              onDelete={() => deleteElement(index)} // Pass delete function to EmptyEle
            />
          ))}
        </div>

        {showHero && (
          <Hero 
            onGeneratedElement={handleGeneratedElement} 
            generatedElements={generatedElements} 
          />
        )}
      </div>
    </div>
  );
}
