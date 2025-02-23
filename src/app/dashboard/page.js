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
        updatedButtons = { ...(userData.buttons || {}), [newButtonName]: "header" }; // Add button as key with empty value
      } else {
        updatedButtons = { [newButtonName]: "" }; // Create new object if user doesn't exist
      }
  
      await setDoc(userRef, { buttons: updatedButtons }, { merge: true }); // Update Firestore
      setButtons(Object.keys(updatedButtons)); // Update local state with button names
    } catch (error) {
      console.error("Error adding button:", error);
    }
  };

  const deleteButton = async (buttonName) => {
    if (!user) return; // Ensure user is signed in
    console.log('signed in');
  
    const userRef = doc(db, 'users', user.id);
  
    try {
      console.log('in try block');
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) return; // If no document exists, exit
      console.log('after doc exist');
  
      const userData = userDoc.data();
      const buttons = userData.buttons || {}; // Get existing buttons object
  
      if (!buttons[buttonName]) return; // If the button does not exist, exit
      console.log('after if button exist');
  
      // Create a new object without the deleted button
      const updatedButtons = { ...buttons };
      delete updatedButtons[buttonName];
  
      // Update Firestore by setting the `buttons` field to the updated object
      await setDoc(userRef, { buttons: updatedButtons });
  
      // Update local state
      setButtons(Object.keys(updatedButtons));
  
      console.log(`${buttonName} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting button:", error);
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
            <div key={index} className="flex items-center justify-between">
                <div 
                onClick={() => handleButtonClick(button)}
                className="flex flex-col bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
                >
                {button}
                </div>
                <div
                onClick={() => deleteButton(button)} // Ensure this is correctly set
                className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                >
                -
                </div>
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