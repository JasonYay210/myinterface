'use client'

import { useUser } from '@clerk/nextjs';
import Hero from "@/components/Hero";
import Standardize from "@/components/Standardize";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function DashboardPage() {
  const [buttons, setButtons] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchButtons = async () => {
        const userRef = doc(db, 'users', user.id);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setButtons(Object.keys(userData.buttons || {})); // Get button names from Firestore
          }
        } catch (error) {
          console.error('Error fetching buttons:', error);
        }
      };
      fetchButtons();
    }
  }, [user]); // Runs whenever `user` changes

  const addButton = async () => {
    const newButtonName = prompt("Enter the name for the new button:");
    if (!newButtonName || !user) return;
  
    const userRef = doc(db, 'users', user.id);
  
    try {
      const userDoc = await getDoc(userRef);
      let updatedButtons = {};
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        updatedButtons = { ...(userData.buttons || {}), [newButtonName]: "" }; // Add button as key with empty value
      } else {
        updatedButtons = { [newButtonName]: "" }; // Create new object if user doesn't exist
      }
  
      await setDoc(userRef, { buttons: updatedButtons }, { merge: true }); // Update Firestore
      setButtons(Object.keys(updatedButtons)); // Update local state with button names
    } catch (error) {
      console.error("Error adding button:", error);
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
