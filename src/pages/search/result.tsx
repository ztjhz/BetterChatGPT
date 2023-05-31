import React, { memo, useEffect, useState } from 'react'
import HorizontalMenu from '@components/HorizontalMenu/menu';
import SearchInput from '@components/Search/searchInput';
import { useParams } from 'react-router-dom';
import { searchChat, searchNews, searchReport, searchSocial } from '@api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from '@components/Chat/CodeBlock';
import useStore from '@store/store';

const searchFuncions:any = {
  chat: searchChat,
  news: searchNews,
  social: searchSocial,
  report: searchReport
}
const SearchResultPage = () => {
  let { question } = useParams();
  const clear = useStore((state) => state.clear)
  const response = useStore((state) => state.response)
  const responseOrder = useStore((state) => state.responseOrder)
  const searchLoading = useStore((state) => state.searchLoading)
  const setReponse = useStore((state) => state.setResponse)
  const setLoading = useStore((state) => state.setSearchLoading)
  const setResponseOrder = useStore((state) => state.setResponseOrder)
  const [searchText, setSearchText] = useState(question)
  
  const handleSubmit = () => {
    clear()

    if(searchText){
      ['chat', 'news', 'social', 'report'].forEach((item) => {
        setLoading(item, true)
        searchFuncions[item].call(null, searchText, (data: any, isDone: any) => {
          setResponseOrder(item)
          setReponse(item, data)
          if(isDone){
            setLoading(item, false)
          }
        }, () => {
          setLoading(item, false)
        })
      })
    }
  }
 
  useEffect(() => {
    handleSubmit()
  }, [])
  const renderLoading = () => {
    return (
      <div role="status" className="space-y-2.5 animate-pulse w-full">
        <div className="flex items-center w-full space-x-2">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
        </div>
        <div className="flex items-center w-full space-x-2 w-full">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
        </div>
        <div className="flex items-center w-full space-x-2 max-w-[480px]">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex w-full h-full flex-1 flex-col bg-gray-50'>
      <div>
        <main className='relative bg-white h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
        <HorizontalMenu />
        </main>
      </div>
      <div className='p-4 flex w-full h-full flex-1 flex-col m-auto max-w-3xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl`'>
        <SearchInput
          value={searchText}
          setValue={setSearchText}
          handleSubmit={handleSubmit}
        />
        <div>
          <div>
            <div className='text-gray-800 w-full bg-white p-4 mt-4 border border-black/10 rounded-md'>
              {responseOrder.map((item: any) => {
                return (
                  <div className='mb-2' key={item}>
                    <MemoryMarkdown data={response[item]}/>
                  </div>
                )
              })}
              {Object.values(searchLoading).some((item: any) => item) && renderLoading()}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

const MemoryMarkdown = memo(({data}: any) => {
  return (
      <ReactMarkdown
        linkTarget='_new'
        className="markdown prose prose prose-slate prose-sm dark:prose-invert flex-1"
        remarkPlugins={[
          remarkGfm,
          [remarkMath],
        ]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            if (children.length) {
              if (children[0] == '▍') {
                return <span className="animate-pulse cursor-default mt-1">▍</span>
              }

              children[0] = (children[0] as string).replace("`▍`", "▍")
            }

            const match = /language-(\w+)/.exec(className || '');

            return !inline ? (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                {children}
              </table>
            );
          },
          th({ children }) {
            return (
              <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="break-words border border-black px-3 py-1 dark:border-white">
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
export default SearchResultPage