'use client';

import React, { useState, useEffect } from "react";

const Hero = ({ onGeneratedElement }) => { // Destructure onGeneratedElement from props
  const [inputText, setInputText] = useState(""); // Renamed to inputText for clarity
  const [result, setResult] = useState(""); // To store current result
  const [animatedResult, setAnimatedResult] = useState(""); // To store animated result
  const [loading, setLoading] = useState(false);

  // Reset the result and animatedResult when inputText changes
  useEffect(() => {
    setResult(""); // Clear previous result
    setAnimatedResult(""); // Clear animated result
  }, [inputText]);

  const handleScrape = async () => {
    try {
      setLoading(true);
      setResult(""); // Clear previous result before fetching new one
      setAnimatedResult(""); // Clear previous animation

      // Send the input text to the API endpoint for processing
      const response = await fetch("/api/MockupCreation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentences: inputText.split(". ") }), // Split input into sentences
      });

      const data = await response.json();
      setResult(data.result); // Set result from API response

      // Animate text after result is set
      animateText(data.result);

      // Call onGeneratedElement prop to send the new result to the parent
      onGeneratedElement(data.result); // This is the key change!

      console.log("data result: " + data.result);
    } catch (error) {
      console.error("Scraping error:", error);
      setResult("Error occurred while processing the input.");
    } finally {
      setLoading(false);
    }
  };

  // Animate the result letter by letter
  const animateText = (text) => {
    if (!text) return; // Return early if text is invalid (empty or undefined)

    let index = -1;
    const intervalId = setInterval(() => {
      if (index < text.length - 1) {
        setAnimatedResult((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(intervalId); // Stop when all text is shown
      }
    }, 10); // Adjust delay (in ms) to control speed of letter-by-letter animation
  };

  return (
    <div className="w-full border border-black rounded-[12px] max-w-[600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between p-4 border-b border-black">
        <p className="text-lg font-semibold">Mockup Creator</p>
        <div className="flex gap-2">
          <p>o</p>
          <p>o</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col p-4 gap-4">
        {/* Scraped Data Container */}
        <div className="bg-black text-white rounded-lg p-4 h-[200px] overflow-y-auto overflow-x-auto hide-scrollbar">
          {result ? (
            <pre className="whitespace-pre-wrap">{animatedResult}</pre> // Show animated result
          ) : (
            <p className="text-gray-400 animate-dots">Awaiting input</p> // Placeholder with animation
          )}
        </div>

        {/* Input Field for User Input */}
        <div className="flex items-center border border-black rounded-lg overflow-hidden">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to create mockup"
            className="flex-grow p-3 text-black"
          />
          <button
            onClick={handleScrape}
            disabled={loading}
            className="w-12 h-12 bg-black text-white flex items-center justify-center"
          >
            {loading ? "..." : "+"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
