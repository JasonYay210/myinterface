"use client";
import React, { useState, useEffect } from "react";

const Hero = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [animatedResult, setAnimatedResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset the result and animatedResult when URL changes
  useEffect(() => {
    setResult(""); // Clear previous result
    setAnimatedResult(""); // Clear animated result
  }, [url]); // Dependency on url, resets whenever it changes

  // To clear the animation interval whenever the component re-renders or resets
  const clearAnimation = () => {
    setAnimatedResult(""); // Clear the previous animation
  };

  const handleScrape = async () => {
    try {
      setLoading(true);
      setResult(""); // Clear previous result before fetching new one
      setAnimatedResult(""); // Clear previous animation

      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setResult(data.result);

      // Animate text after result is set
      animateText(data.result);
    } catch (error) {
      console.error("Scraping error:", error);
      setResult("Error occurred while scraping");
    } finally {
      setLoading(false);
    }
  };

  // Animate the result letter by letter
  const animateText = (text) => {
    if (!text) return; // Return early if text is invalid (empty or undefined)

    let index = -1;
    const intervalId = setInterval(() => {
      if (index < text.length-1) {
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
        <p className="text-lg font-semibold">SEO Optimizer</p>
        <div className="flex gap-2">
          <p>o</p>
          <p>o</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col p-4 gap-4">
        {/* Scraped Data Container (Always visible, with no content until loaded) */}
        <div className="bg-black text-white rounded-lg p-4 h-[200px] overflow-y-auto overflow-x-auto hide-scrollbar">
          {result ? (
            <pre className="whitespace-pre-wrap">{animatedResult}</pre> // Show animated result
          ) : (
            <p className="text-gray-400 animate-dots">Awaiting link</p> // Placeholder with animation
          )}
        </div>

        {/* URL Input and Button */}
        <div className="flex items-center border border-black rounded-lg overflow-hidden">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to scrape"
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
