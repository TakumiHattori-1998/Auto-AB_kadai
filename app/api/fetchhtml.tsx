import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {url} = req.query;
    console.log(url);
    if (typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Puppeteer APIによるページのhtml取得
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' }); // Wait for all network requests to finish
        const html = await page.content();

        await browser.close();

        res.status(200).json(html);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to retrieve content' });
    }
}