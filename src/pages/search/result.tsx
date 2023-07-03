import React, { memo, useEffect, useRef, useState } from 'react'
import SearchInput from '@components/Search/searchInput';
import { useNavigate, useParams } from 'react-router-dom';
import { getSearchByType, simplifyQuestion } from '@api/api';
import useStore from '@store/store';
import { useAuth0 } from '@auth0/auth0-react';
import { SignInModal, TransparentHeader } from '@components/Header/transparent';
import { toast, ToastContainer } from 'react-toastify';
import { useAccount } from 'wagmi';
import { searchFuncions } from './variable';
import { SimpleLoading } from './simpleLoading';
import { FreeTip } from '@components/FreeTip';
import { AnswerBlock } from './answerBlock';

const SearchResultPage = () => {
  let { question } = useParams();
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
  const navigate = useNavigate();
  const simpleLoadingRef = useRef<any>();
  const handleSubmit = async () => {
    clearController()
    clear()
    if(searchText){
      if(searchText.length > 150){
        simpleLoadingRef?.current?.hide();
        return toast.error('Question is too long')
      }
      navigate('/search/' + encodeURIComponent(searchText), {
        replace: true
      })
      simpleLoadingRef?.current?.restart();
      const {data: question } = await simplifyQuestion(searchText)
      //@ts-ignore
      window?.gtag("event", "search", {
        event_category: "user_action",
        event_label: searchText,
      })
      fetchCredit()
      searchFuncions.forEach(async (item: any) => {
        setLoading(item.name, true)
        const controller = await getSearchByType({
          type: item.api || item.name,
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
      clearController()
    }
  }, [])
  const closeLoading = searchFuncions.some((item: any) => {
    const s = getStatusByKey(item.name)
    return s === 'message' || s === 'done'
  })

  return (
    <div className='flex min-h-full w-full flex-1 flex-col bg-gray-1000'>
      <div>
      <TransparentHeader showLogo />
      </div>
      <FreeTip />
      <div className='flex h-full flex-1 md:px-4 flex-col w-full m-auto max-w-3xl md:max-w-3xl lg:max-w-3xl xl:max-w-5xl'>
        <div className="p-4 md:p-0 md:mt-10 bg-bg-50 md:bg-transparent">
          <SearchInput
            value={searchText}
            setValue={setSearchText}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className='px-2 md:px-0'>
          <SimpleLoading ref={simpleLoadingRef} query={question}/>
        </div>
        <div className='w-full mt-0 md:mt-4'>
          <div className={`${closeLoading ? 'mt-4' : 'hidden'} transition-all lg:max-w-fit`}>
            {searchFuncions.map((item: any) => {
              if(!response[item.name]){
                return null
              }
              return (
                <AnswerBlock 
                  key={item.name}
                  searchText={question as string}
                  funcDefination={item}
                  response={response[item.name]}
                  status={getStatusByKey(item.name)}
                />
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

export default SearchResultPage

