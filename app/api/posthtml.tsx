import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

// デフォルトのボディパーサーを無効化
export const config = {
    api: {
      bodyParser: false,
    },
  };

const readBody = async (req: NextApiRequest): Promise<string> => {
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    // console.log(Buffer.concat(chunks).toString('utf-8'));
    return Buffer.concat(chunks).toString('utf-8');
};


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    // AWS bedrock APIへURLから取得したファイルをPOST
    const html = await readBody(req);
    const url = 'https://sample.com';

    const JSONdata = {
        'key1': html,
    };
    console.log('below is html send to aws bedrock');
    console.log(html);

    try{
        // AWSにHTMLをPOST、出力を受信
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(JSONdata),
        })

        if (!response.ok) {
            throw new Error(`Failed to send data: ${response.statusText}`);
        }

        const reply_from_bedrock = await response.json();

        const result = {
            'html':html,
            'aws_reply':reply_from_bedrock,
        }

        // bedrockの出力を整形してファイルとして保存
        const regex = /(?<=<START>)([\s\S]*?)(?=<END>)/g;
        const match = await reply_from_bedrock.match(regex);
        
        if (match !== null){
            console.log('posthtml match')
            console.log(match[0]);
            const path = require('path');
            const directory = 'downloads';
            const filePath = path.join(directory, 'output.html')

            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
              }

            fs.writeFile(filePath, match[0], (err) => {
                if (err) throw err;
                console.log(filePath);
                console.log('The file has been saved!');
            });
        }else{
            console.log('there is no match');
        }

        res.status(200).json(result);

    } catch (error) {
        console.error('Error on AWS API:', error);
    }
}