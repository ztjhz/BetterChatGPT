import React, { memo, useEffect, useState } from 'react'
import HorizontalMenu from '@components/HorizontalMenu/menu';
import SearchInput from '@components/Search/searchInput';
import { useNavigate, useParams } from 'react-router-dom';
import { getSearchByType } from '@api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from '@components/Chat/CodeBlock';
import useStore from '@store/store';
import Logo from '@logo/color';
import { t } from 'i18next';
const searchFuncions:any = [
  {
    name: 'chat', 
    emoji: '📝',
    label:'0xFAQ LLM',
  }, 
  {
    name: 'news', 
    emoji: '📰',
    label:'Web3 News',
  }, 
  {
    name: 'social', 
    emoji: '📎',
    label:'Social Media',
  }, 
  {
    name: 'report', 
    emoji: '📚',
    label:'Research Report',
  }, 
  {
    name: 'sql', 
    emoji: '📊',
    label:'Structured data',
  }, 
  {
    name: 'knowledge', 
    emoji: '📌',
    label:'Knowledge Graph',
  }, 
]

const statusStyles: any = {
  'unUseful': 'bg-gray-500',
  'loading': 'bg-emerald-700',
  'message': 'bg-yellow-500',
  'done': 'bg-green-500'
}

const SearchResultPage = () => {
  let { question } = useParams();
  const clear = useStore((state) => state.clear)
  const response = useStore((state) => state.response)
  const searchStatus = useStore((state) => state.searchStatus)
  const setSearchStatus = useStore((state) => state.setSearchStatus)
  const responseOrder = useStore((state) => state.responseOrder)
  const searchLoading = useStore((state) => state.searchLoading)
  const setReponse = useStore((state) => state.setResponse)
  const setLoading = useStore((state) => state.setSearchLoading)
  const setResponseOrder = useStore((state) => state.setResponseOrder)
  const [searchText, setSearchText] = useState(question)
  const navigate = useNavigate();
  const handleSubmit = () => {
    clear()

    if(searchText){
      navigate('/search/' + searchText, {
        replace: true
      })
      searchFuncions.forEach((item: any) => {
        setLoading(item.name, true)
        getSearchByType({
          type: item.name,
          query: searchText,
          callback: (data: any, isDone: any) => {
            setResponseOrder(item.name)
            setReponse(item.name, data)
            if(isDone){
              setLoading(item.name, false)
            }
          },
          eventHandler: (event: string, value?: string) => {
            setSearchStatus(item.name, event, value || '')
          },
          onError:() => {
            setLoading(item.name, false)
          }
        })
      })
    }
  }
 
  useEffect(() => {
    handleSubmit()
  }, [])
  const renderLoading = () => {
    const loadingText = "After analysis, we will provide you with answers from the following data:"
    const noAnwser = Object.values(searchStatus).every((item: any) => {
      return item.currentEvent === 'done' && response[item.name] === ''
    })
    return (
      <div>
        <div className='flex gap-1 flex-wrap'>
          {loadingText.split(' ').map((word: string, idx: number) => {
            return (
              <DelayedElement timeout={idx * 300}>
                {word}
              </DelayedElement>
            )
          })}
        </div>
        <div className='flex gap-3 flex-wrap'>
          {searchFuncions.map((item: any, index: number) => {
            const status = searchStatus[item.name]?.currentEvent
            const unUsefulState = status === 'done' && response[item.name] === ''
            const doneState = status === 'done' && response[item.name] !== ''
            const loadingState = status === 'start'
            const messageState = status === 'message'
            let currentState = 'loading'
            if(unUsefulState){
              currentState = 'unUseful'
            }else if(doneState){
              currentState = 'done'
            }else if(loadingState){
              currentState = 'loading'
            }else if(messageState){
              currentState = 'message'
            }

            return (
              <DelayedElement timeout={(loadingText.split(' ').length * 300) + index * 600}>
                  <div className={`my-2`}>
                    <div className={`flex gap-2 ${statusStyles[currentState]} text-white text-xs rounded-full px-2 items-center max-w-fit`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`${currentState === 'done' || currentState === 'unUseful' ? 'hidden' : '' }animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-200 opacity-75`}></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400 "></span>
                        </span>
                          {item.label} {item.emoji}
                    </div>
                  </div>
              </DelayedElement>
            )
          })}
        </div>
        {noAnwser && (
          <DelayedElement timeout={1}>
            <div className='mt-2 text-sm'>
              {t('noAnswer')}
            </div>
          </DelayedElement>
        )}
      </div>
    )
  }

  return (
    <div className='flex min-h-full w-full flex-1 flex-col bg-gradient-to-t from-gray-200 to-gray-50'>
      <div>
        <main className='relative bg-white opacity-70 h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
        <HorizontalMenu />
        </main>
      </div>
      <div className='p-4 flex w-full h-full flex-1 flex-col m-auto max-w-3xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl`'>
        <SearchInput
          value={searchText}
          setValue={setSearchText}
          handleSubmit={handleSubmit}
        />
        <div className='text-gray-800 w-full bg-white p-4 mt-4 rounded-md'>
          <div className='mb-4'>
            {renderLoading()}
          </div>
          {searchFuncions.map((item: any) => {
            return (
              <div className={`mb-6`} key={item.name}>
                <div className={`flex gap-x-3 align-top ${!response[item.name] && 'hidden'}`}>
                  <div
                    className='relative h-[30px] w-[30px] p-1 rounded-sm bg-gray-50 text-white flex items-center justify-center'
                  >
                    <Logo />
                  </div>
                  :
                  <div className='flex-1'>
                    <MemoryMarkdown data={response[item.name]}/>
                  </div>
                </div>
              </div>
            )
          })}
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
          remarkGfm
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
              <div className='w-full overflow-x-scroll'>
                <table className="border-solid">
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


const DelayedElement = ({children, timeout}: any) => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, timeout)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className={`${show ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {children}
    </div>
  )
}
export default SearchResultPage