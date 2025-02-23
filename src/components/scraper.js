import { Groq } from 'groq-sdk';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import axios from 'axios';
import React, { useState } from 'react';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function fetchCSS(cssUrl) {
  try {
    const response = await axios.get(cssUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching CSS:", error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    const content = await page.content();
    const cssLinks = await page.$$eval('link[rel="stylesheet"], style', links =>
      links.map(link => (link.tagName.toLowerCase() === 'link' ? link.href : link.innerHTML))
    );
    
    await browser.close();
    
    const $ = cheerio.load(content);
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const headings = $('h1, h2, h3').map((_, el) => $(el).text()).get();
    const paragraphs = $('p').map((_, el) => $(el).text()).get();
    const links = $('a').map((_, el) => $(el).attr('href')).get();
    const images = $('img').map((_, el) => $(el).attr('alt') || 'No alt text').get();
    const lists = $('ul, ol').map((_, el) => $(el).text()).get();

    let cssContent = '';
    for (const cssLink of cssLinks) {
      if (cssLink.startsWith('http')) {
        const cssData = await fetchCSS(cssLink);
        if (cssData) cssContent += cssData;
      } else {
        cssContent += cssLink;
      }
    }
    
    const htmlIssues = [];
    if (!headings.length) htmlIssues.push('No headings found');
    if (!metaDescription) htmlIssues.push('No meta description found');
    if (!images.length) htmlIssues.push('No alt text for images found');
    
    const cssIssues = [];
    if (!cssContent.includes('@media')) cssIssues.push('No media queries found');
    if (cssContent.includes('!important')) cssIssues.push('Use of !important found');
    if (cssContent.includes('position: absolute')) cssIssues.push('Use of position: absolute found');

    const scrapedData = { title, metaDescription, headings, paragraphs, links, images, lists, cssIssues, htmlIssues };

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Analyze web content for HTML structure, CSS practices, accessibility, and SEO.',
        },
        {
          role: 'user',
          content: `Title: ${title}\nMeta Description: ${metaDescription}\nHTML Issues: ${JSON.stringify(htmlIssues)}\nCSS Issues: ${JSON.stringify(cssIssues)}\n`,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      max_tokens: 500,
    });

    return NextResponse.json({ result: completion.choices[0].message.content, scrapedData });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Error scraping the website' }, { status: 500 });
  }
}

const CreateScraper = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Scrape error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Web Scraper with AI Analysis</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to scrape"
        className="w-full p-3 mb-4 border rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleScrape}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Scraping...' : 'Scrape URL'}
      </button>
      {result && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto max-h-96">
          <h3 className="text-xl font-semibold mb-4">Scraped Data Analysis</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateScraper;
