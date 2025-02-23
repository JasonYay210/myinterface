"use client"
import React, { useState } from 'react';

// import Logo from './Logo';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Scraping error:', error);
      setResult('Error occurred while scraping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero my-5 text-center" data-testid="hero">
      <h1 className="mb-4" data-testid="hero-title">
        MyInterface
      </h1>

      <p className="lead" data-testid="hero-lead">
        An AI-driven tool ensures industry-standard UI/UX formatting and SEO, allowing you to focus on what truly matters - YOUR CONTENT.
      </p>
      <h1 className="mb-4" data-testid="hero-title">
        Web Scraper with AI Analysis
      </h1>

      <div className="max-w-3xl mx-auto">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scrape"
          className="w-full p-3 mb-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleScrape}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-black rounded-lg shadow-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Scraping...' : 'Scrape URL'}
        </button>

        {result && (
          <div className="mt-8 p-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto max-h-[500px]">
            <h3 className="text-xl font-semibold mb-4">Scraped Data Analysis</h3>
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              <pre>{result}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
