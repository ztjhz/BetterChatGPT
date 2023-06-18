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
import HandThumbUpIcon from '@heroicons/react/24/outline/HandThumbUpIcon'
import HandThumbDownIcon from '@heroicons/react/24/outline/HandThumbDownIcon'
import { request } from '@api/request';
import { useAuth0 } from '@auth0/auth0-react';
import { SignInModal, TransparentHeader } from '@components/Header/transparent';
import { toast, ToastContainer } from 'react-toastify';
import { useAccount } from 'wagmi';
const searchFuncions:any = [
  {
    name: 'knowledge', 
    emoji: '📌',
    label:'Knowledge Graph',
  }, 
  {
    name: 'chat', 
    emoji: '📝',
    label:'QnA3 LLM',
  }, 
  {
    name: 'sql', 
    emoji: '📊',
    label:'Structured data',
  }, 
  {
    name: 'report', 
    emoji: '📚',
    label:'Research Report',
  }, 
  {
    name: 'vector_news', 
    emoji: '📰',
    label:'Web3 News',
  }, 
  {
    name: 'social', 
    emoji: '📎',
    label:'Social Media',
  }, 
]

const SearchResultPage = () => {
  let { question } = useParams();
  const { user, loginWithRedirect, logout, isLoading, isAuthenticated } = useAuth0();
  const { address, isConnected } = useAccount()
  const isSignedIn = isAuthenticated || isConnected
  const clear = useStore((state) => state.clear)
  const response = useStore((state) => state.response)
  const searchStatus = useStore((state) => state.searchStatus)
  const setSearchStatus = useStore((state) => state.setSearchStatus)
  const getStatusByKey = useStore((state) => state.getStatusByKey)
  const setController = useStore((state) => state.setController)
  const clearController = useStore((state) => state.clearController)
  const setReponse = useStore((state) => state.setResponse)
  const setLoading = useStore((state) => state.setSearchLoading)
  const setResponseOrder = useStore((state) => state.setResponseOrder)
  const fetchCredit = useStore((state) => state.fetchCredit)
  const [searchText, setSearchText] = useState(decodeURIComponent(question as string))
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [voteType, setVoteType] = useState<any>({})
  const navigate = useNavigate();
  const handleSubmit = async () => {
    clear()
    setVoteType({})
    if(searchText){
      navigate('/search/' + encodeURIComponent(searchText), {
        replace: true
      })
      const {data: question } = await simplifyQuestion(searchText)
      fetchCredit()
      searchFuncions.forEach(async (item: any) => {
        setLoading(item.name, true)
        const controller = await getSearchByType({
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
        setController(controller)
      })
    }
  }
 
  useEffect(() => {
    handleSubmit()

    return () =>{
      clear()
      setVoteType({})
      clearController()
    }
  }, [])
  const closeLoading = searchFuncions.some((item: any) => {
    const s = getStatusByKey(item.name)
    return s === 'message' || s === 'done'
  })

  const onVote = async (type: string, func: string, content: string) => {
    try{
      const votePromise =  request.post('/search/vote', {
        vote_type: type,
        question: searchText,
        answer: JSON.stringify({
          [func]: content
        }),
      })
      setVoteType({
        ...voteType,
        [func]: type
      })
      toast.promise(
        votePromise,
        {
          pending: 'Voting...',
          success: t('voteSuccess') as string,
          error: t('voteFailed')
        }
      )
    }catch{
      toast.error(t('voteFailed'))
    }
  }

  const noAnwser = Object.keys(searchStatus).length && Object.values(searchStatus).every((item: any) => {
    return (item.currentEvent === 'done' || item.currentEvent === 'unUseful') && response[item.name] === ''
  })
  const renderLoading = () => {
    const loadingText = "After analysis, we will provide you with answers from the following data:"
    
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
  const renderVoteButton = (func: string, content: string) => {
    return (
      <div className='flex gap-4  justify-end'>
        <button onClick={() => onVote('upvote', func, content)}>
          <HandThumbUpIcon className={`w-5 h-5  text-${voteType[func] === 'upvote' ? 'emerald-400 fill-emerald-400' : 'emerald-400'}`}/>
        </button>
        <button onClick={() => onVote('downvote', func, content)}>
          <HandThumbDownIcon className={`w-5 h-5 text-${voteType[func] === 'downvote' ? 'emerald-400 fill-emerald-400' : 'emerald-400'}`}/>
        </button>
      </div>
    )
  }

  return (
    <div className='flex min-h-full w-full flex-1 flex-col bg-gradient-to-t from-gray-200 to-gray-50'>
      <div>
      <TransparentHeader showLogo />
      </div>
      <div className='p-4 flex w-full h-full flex-1 flex-col m-auto max-w-3xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl'>
        <SearchInput
          value={searchText}
          setValue={setSearchText}
          handleSubmit={handleSubmit}
        />
        <div className='text-gray-800 w-full bg-white py-4 pb-0 mt-4 rounded-md'>
          <div className={`px-2 md:px-4 ${!closeLoading ? 'mb-4' : ''}`}>
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
                  <div className={`flex mt-2 justify-between border-emerald-400 border rounded-lg p-2 transition-all ${(response[item.name]) ? '' : "hidden"}`}>
                    <div className="flex text-sm text-emerald-900" role="alert">
                        <svg className="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                        <div>
                            <span className="font-medium">{t('voteTip.title')}</span> {t('voteTip.content')}
                        </div>
                    </div>
                    {renderVoteButton(item.name, response[item.name])}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <SignInModal 
        isOpen={loginModalOpen}
        setIsOpen={setLoginModalOpen}
      />
      <ToastContainer 
        autoClose={3000}
      />
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