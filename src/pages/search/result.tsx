import React, { memo, useEffect, useState } from 'react'
import HorizontalMenu from '@components/HorizontalMenu/menu';
import SearchInput from '@components/Search/searchInput';
import { useNavigate, useParams } from 'react-router-dom';
import { getSearchByType, simplifyQuestion } from '@api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from '@components/Chat/CodeBlock';
import useStore from '@store/store';
import Logo from '@logo/color';
import { t } from 'i18next';
import { LoadingBlock } from '@components/LoadingBlock';
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

const SearchResultPage = () => {
  let { question } = useParams();
  const clear = useStore((state) => state.clear)
  const response = useStore((state) => state.response)
  const searchStatus = useStore((state) => state.searchStatus)
  const setSearchStatus = useStore((state) => state.setSearchStatus)
  const getStatusByKey = useStore((state) => state.getStatusByKey)
  const setReponse = useStore((state) => state.setResponse)
  const setLoading = useStore((state) => state.setSearchLoading)
  const setResponseOrder = useStore((state) => state.setResponseOrder)
  const [searchText, setSearchText] = useState(question)
  const navigate = useNavigate();
  const handleSubmit = async () => {
    clear()

    if(searchText){
      navigate('/search/' + searchText, {
        replace: true
      })
      const {data: question } = await simplifyQuestion(searchText)
      searchFuncions.forEach((item: any) => {
        setLoading(item.name, true)
        getSearchByType({
          type: item.name,
          query: question,
          originalQuestion: searchText,
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
  const closeLoading = searchFuncions.some((item: any) => {
    const s = getStatusByKey(item.name)
    return s === 'message' || s === 'done'
  })

  const renderLoading = () => {
    const loadingText = "After analysis, we will provide you with answers from the following data:"
    const noAnwser = Object.keys(searchStatus).length && Object.values(searchStatus).every((item: any) => {
      return item.currentEvent === 'done' && response[item.name] === ''
    })
    
    return (
      <div>
        <div className={`flex gap-1 flex-wrap mb-3 text-sm transition-all ${closeLoading ? 'hidden h-0' : ''}`} style={{
          lineHeight: '1'
        }}>
          {loadingText.split(' ').map((word: string, idx: number) => {
            return (
              <DelayedElement timeout={idx * 300}>
                {word}
              </DelayedElement>
            )
          })}
        </div>
        <div className={`gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5`}>
          {searchFuncions.map((item: any, index: number) => {
            const status=getStatusByKey(item.name)
            return (
              <DelayedElement timeout={(loadingText.split(' ').length * 300) + index * 600}>
                  <LoadingBlock 
                    title={item.label}
                    status={status}
                    open={!closeLoading}
                  />
              </DelayedElement>
            )
          })}
        </div>
        {noAnwser === true && (
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
        <div className='text-gray-800 w-full bg-white py-4 mt-4 rounded-md'>
          <div className='px-2 md:px-4'>
            {renderLoading()}
          </div>
          <div className={`${closeLoading ? 'mt-4' : 'hidden'} transition-all lg:max-w-fit`}>
            {searchFuncions.map((item: any) => {
              if(!response[item.name]){
                return null
              }
              return (
                <div className={`py-2 px-4`} key={item.name}>
                  <div className='px-2 py-1 text-gray-600 text-sm bg-gray-50 max-w-fit my-2 rounded-md'>
                    {item.emoji} {item.label}:
                  </div>
                  <MemoryMarkdown data={response[item.name]}/>
                </div>
              )
            })}
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
        className="markdown prose prose-slate prose-sm dark:prose-invert flex-1"
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
                 <div dangerouslySetInnerHTML={{__html: children as string}} />
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