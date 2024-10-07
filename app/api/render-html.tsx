import { NextApiRequest, NextApiResponse } from 'next';
import * as puppeteer from 'puppeteer';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import axios from 'axios';
import crypto from 'crypto';
import { JSDOM } from 'jsdom';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// ファイルをダウンロードではなく絶対パスに置き換える関数
interface LinkConverterOptions {
  inputHtml: string;
  baseUrl: string;
  outputFolder: string;
}

async function convertLinks({inputHtml,baseUrl,outputFolder}: LinkConverterOptions): Promise<string> {
  const convertToAbsolutePaths = (html: string, baseUrl: string): string => {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const targets = [
      { tag: 'img', attr: 'src' },
      { tag: 'script', attr: 'src' },
      { tag: 'link', attr: 'href' },
      { tag: 'a', attr: 'href' }
    ];

    targets.forEach(({ tag, attr }) => {
      document.querySelectorAll(tag).forEach((element: Element) => {
        const value = element.getAttribute(attr);
        if (value && !value.startsWith('http') && !value.startsWith('//')) {
          element.setAttribute(attr, new URL(value, baseUrl).href);
        }
      });
    });

    return dom.serialize();
  };

  const saveOutputHtml = async (html: string): Promise<string> => {
    const fileName = `converted_${Date.now()}.html`;
    const outputPath = path.join(outputFolder, fileName);
    
    try {
        await fsPromises.writeFile(outputPath, html, 'utf-8');
        console.log(`Converted HTML saved to: ${outputPath}`);

        // puppeteer操作
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'],});
        const page = await browser.newPage();
        // Set content and wait for resources to load
        await page.setContent(html, { waitUntil: ['load', 'networkidle0', 'domcontentloaded'] });
        // Set viewport size
        await page.setViewport({ width: 1200, height: 800 });
        // Take screenshot
        const screenshotPath = path.join(outputFolder, 'screenshot.png')
        const Buffer = await page.screenshot({ path: screenshotPath, fullPage: true, type: 'png', encoding: 'binary'});
        await browser.close();

        return screenshotPath;
    } catch (error) {
      console.error('Error saving the converted HTML:', error);
      throw error;
    }
  };

  try {
    const convertedHtml = convertToAbsolutePaths(inputHtml, baseUrl);
    const output = await saveOutputHtml(convertedHtml);
    return output;
  } catch (error) {
    console.error('Error in convertLinks:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;
    console.log(url);

    const htmlContent = await fsPromises.readFile('downloads/output.html', 'utf8');

    if (!htmlContent) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // 保存先のディレクトリの作成
    const publicDir = path.join(process.cwd(), 'public');
    const bytes = crypto.randomBytes(Math.ceil(10 / 2));
    const folderName = bytes.toString('hex').slice(0, 10);
    const dirPath = path.join(publicDir, `temp-${folderName}`);
    fsPromises.mkdir(dirPath, { recursive: true });
    console.log(dirPath);

    const screenshot = await convertLinks({inputHtml:htmlContent, baseUrl:url, outputFolder:dirPath});
    const result = {
        screenshot: screenshot,
    }
    console.log(screenshot);
    res.status(200).json(result);

  } catch (error) {
    console.error('Error rendering HTML:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}