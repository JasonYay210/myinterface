'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Hero from "@/components/MockupCreation"; // Assuming Hero is the component generating elements
import EmptyEle from "@/components/EmptyEle";
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Added setDoc import for saving data
import { db } from '../../../../firebase';
import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook

export default function MockupCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonName = searchParams.get('name'); // Get the button name from URL
  const { user } = useUser();

  const [generatedElements, setGeneratedElements] = useState([]); // Track generated elements
  const [showHero, setShowHero] = useState(true);
  const [retrievedValue, setRetrievedValue] = useState(''); // Store retrieved value

  const refreshDb = async () => {
    if (user && buttonName) {
      const userRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userRef);
  
      let updatedButtons = {};
      if (userDoc.exists()) {
        const userData = userDoc.data();
        updatedButtons = userData.buttons || {}; // Keep existing buttons
  
        // Store the raw generated elements without stringifying
        updatedButtons[buttonName] = generatedElements; // Save directly without JSON.stringify
      } else {
        // If user doesn't exist, create a new entry
        updatedButtons = { [buttonName]: generatedElements }; // Save directly without JSON.stringify
      }
  
      // Update Firestore document without overwriting existing data
      await setDoc(userRef, { buttons: updatedButtons }, { merge: true });
  
      console.log("Button updated successfully:", updatedButtons);
    }
  };
  

  useEffect(() => {
    if (user && buttonName && generatedElements.length > 0) {
      refreshDb(); // Call refreshDb after generatedElements change
    }
  }, [generatedElements, user, buttonName]); // Triggered when user, buttonName, or generatedElements change

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

  useEffect(() => {
    const getValue = async () => {
      if (!user || !user.id) {  // Ensure user is defined before accessing its ID
        console.error("User is not defined yet.");
        return;
      }
  
      try {
        const userRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          console.error("User document does not exist.");
          return;
        }
  
        const userData = userDoc.data();
        const updatedButtons = userData?.buttons || {};
        const value = updatedButtons[buttonName] || "";
  
        setRetrievedValue(value); // Store retrieved value in state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    if (buttonName && user) { // Ensure user exists before fetching data
      getValue();
    }
  }, [buttonName, user]); // Run when buttonName or user changes

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
        <div dangerouslySetInnerHTML={{ __html: retrievedValue }} /> {/* Render as HTML */}
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
