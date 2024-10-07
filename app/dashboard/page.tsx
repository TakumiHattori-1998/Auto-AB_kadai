"use client"

import { lusitana } from '@/app/ui/fonts';
import React, { useState, useEffect } from 'react';
import SideMenu from '../components/SideMenu';
import DashboardLayout from '@/app/dashboard/layout';

const DashboardPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  // const [html, setHtml] = useState<string>('');
  const [screenshot, setScreenshot] = useState<string>('');

  const fetchHTML = async () => {
      try {
          const response = await fetch(`api/fetchhtml?url=${encodeURIComponent(url)}`);
          if (response.ok) {
              const result = await response.json();
              console.log(result);
              // setHtml(result); // setState は非同期だが、await は不要
              await fetchBedRockReply(result); // html が設定された後に呼び出す
          } else {
              console.error('response is not ok');
          }
      } catch (error) {
          console.error('Failed to fetch HTML');
      }
  };

  const fetchBedRockReply = async (result) => {
      try {
          const response = await fetch('api/posthtml', {
              method: 'POST',
              headers: {
                  'Content-Type': 'text/html',
              },
              body: result, // この時点で最新の html 値が使用される
          });

          if (response.ok) {
              const result_bedrock = await response.json();
              console.log('success get bedrock reply');
          } else {
              console.error('response is not ok');
          }

          const response_renderedHtml = await fetch(`api/render-html?url=${encodeURIComponent(url)}`);

          if (response_renderedHtml.ok) {
              const result = await response_renderedHtml.json();

              const extractLastTwoLayers = (path: string): string => {
                  const parts = path.split('/').filter(part => part !== '');
                  const lastThree = parts.slice(-2);
                  return lastThree.join('/');
              };

              const screenshotPath = extractLastTwoLayers(result.screenshot);

              setScreenshot(screenshotPath);
          } else {
              console.error('Error:', await response_renderedHtml.text());
          }

      } catch (error) {
          console.log(error);
          console.error('Failed to fetch screenshot');
      }
  };

  return (
    <div className="flex w-full flex-col md:col-span-4 ml-[20px] mt-[20px]">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Enter URL to test
        </h2>
        <div className="flex space-x-[10px] max-w-[800px]">
            <input className="bg-gray-200 border-none rounded-xl w-[70%] focus:outline-none pl-3" type="text" onChange={(e) => setUrl(e.target.value)}/>
            <button className="bg-black border-none text-white rounded-xl w-[20%] hover:bg-gray-500" onClick={fetchHTML}>check design</button>
        </div>
        <div className="flex w-full flex-col md:col-span-4 mt-[20px] bg-gray-200 h-[400px] max-w-[1200px]">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl ml-[10px] mt-[10px]`}>
                Variations
            </h2>
            <div className="flex space-x-[10px] max-w-[800px]">
                {screenshot && <img src={screenshot} alt='screenshot'/>}
            </div>
        </div>
    </div>
  );



//   return (
//     <DashboardLayout>
//       <div>
//         <div className="flex w-full flex-col md:col-span-4 ml-[20px] mt-[20px]">
//             <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
//                 Enter URL to test
//             </h2>
//             <div className="flex space-x-[10px] max-w-[800px]">
//                 <input className="bg-gray-50 border-none rounded-xl w-[70%] focus:outline-none pl-3" type="text" onChange={(e) => setUrl(e.target.value)}/>
//                 <button className="bg-gray-500 border-none text-white rounded-xl w-[20%] hover:bg-black" onClick={fetchHTML}>check design</button>
//             </div>
//             <div className="flex w-full flex-col md:col-span-4 mt-[20px] bg-gray-50 h-[400px] max-w-[1200px]">
//                 <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl ml-[10px] mt-[10px]`}>
//                     Variations
//                 </h2>
//                 <div className="flex space-x-[10px] max-w-[800px]">
//                     {screenshot && <img src={screenshot} alt='screenshot'/>}
//                 </div>
//             </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
//   return (
//     <div>
//         <h1>dashboard home</h1>
//     </div>
//   );

};

export default DashboardPage;