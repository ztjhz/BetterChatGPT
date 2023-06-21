import React, { memo, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { ReactionBar } from '@components/ReactionBar';
import { t } from 'i18next';

interface AnswerBlockProps {
  funcDefination: any,
  response: any,
  status: string,
  searchText: string
}
export const AnswerBlock = ({funcDefination: item, response, status, searchText}: AnswerBlockProps) => {
  return (
    <div className={`p-4 bg-bg-50 border border-bg-200 rounded-none md:rounded-xl mb-6`} key={item.name}>
      <div className='flex gap-4'>
        <div>
          <LetterAvatar name={item.label} size={30} radius={15}/>
        </div>
        <div className='mt-1'>
          <div className='flex gap-2 items-center mb-4'>
            <div className='text-md text-white'>
              {item.label}
            </div>
            {status === 'message' ? (<div className='text-txt-60 text-sm animate-pulse'>
              {t('typing')}
            </div>) : ''}
          </div>
          <MemoryMarkdown data={response}/>
        </div>
      </div>
      
      <ReactionBar 
        funcDefination={item}
        response={response} 
        status={status}
        searchText={searchText}
      />
    </div>
  )
}
let avatarColors = [
  [226, 95, 81],// A
  [242, 96, 145],// B
  [187, 101, 202],// C
  [149, 114, 207],// D
  [120, 132, 205],// E
  [91, 149, 249],// F
  [72, 194, 249],// G
  [69, 208, 226],// H
  [72, 182, 172],// I
  [82, 188, 137],// J
  [155, 206, 95],// K
  [212, 227, 74],// L
  [254, 218, 16],// M
  [247, 192, 0],// N
  [255, 168, 0],// O
  [255, 138, 96],// P
  [194, 194, 194],// Q
  [143, 164, 175],// R
  [162, 136, 126],// S
  [163, 163, 163],// T
  [175, 181, 226],// U
  [179, 155, 221],// V
  [194, 194, 194],// W
  [124, 222, 235],// X
  [188, 170, 164],// Y
  [173, 214, 125]// Z
]
const LetterAvatar = ({name, size, radius}: any) => {
  let char = name.trim()[0].toUpperCase()
  let bgColor
  if( /[A-Z]/.test(char) ){
    let index = char.charCodeAt() - 65
    bgColor = avatarColors[index]
  }else if( /[\d]/.test(char) ){
    bgColor = avatarColors[parseInt(char)]
  }else{
    bgColor = [0,0,0]
  }
  let style:any = {
    backgroundColor: `rgb(${bgColor})`,
    width: size,
    height: size,
    font: Math.floor(size/2) + 'px/100px Helvetica, Arial, sans-serif',
    lineHeight: (size + Math.floor(size/10)) + 'px',
    color: "rgba(233,233,233,0.9)",
    textAlign: 'center',
    borderRadius: radius 
  }

  return(
    <div style={style}>
      {char}
    </div>
  )
}
const MemoryMarkdown = memo(({data}: any) => {
  return (
      <ReactMarkdown
        linkTarget='_new'
        className="markdown prose prose-slate prose-sm dark:prose-invert flex-1"
        remarkPlugins={[
          remarkGfm
        ]}
        components={{
          table({ children }) {
            return (
              <div className='w-full overflow-x-scroll'>
                <table className="border-solid mt-0">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="break-words border border-gray-400 bg-gray-700 px-3 py-1 dark:border-white">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="break-words border border-gray-400 px-3 py-1 dark:border-white">
                 {children}
              </td>
            );
          },
        }}
      >
        {data}
      </ReactMarkdown>
  )
})