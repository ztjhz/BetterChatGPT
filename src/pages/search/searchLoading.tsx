import useStore from "@store/store"
import { searchFuncions } from "./variable"
import { useEffect, useState } from "react"
import { LoadingBlock } from "@components/LoadingBlock"
import { t } from 'i18next';


export const SearchLoading = () => {
  const getStatusByKey = useStore((state) => state.getStatusByKey)
  const searchStatus = useStore((state) => state.searchStatus)
  const response = useStore((state) => state.response)
  const loadingText = "After analysis, we will provide you with answers from the following data:"
  const noAnwser = Object.keys(searchStatus).length && Object.values(searchStatus).every((item: any) => {
    return (item.currentEvent === 'done' || item.currentEvent === 'unUseful') && response[item.name] === ''
  })
  const closeLoading = searchFuncions.some((item: any) => {
    const s = getStatusByKey(item.name)
    return s === 'message' || s === 'done'
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