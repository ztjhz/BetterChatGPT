import React from 'react'
import { AcitivityItem } from './ActivityItem'
import { t } from 'i18next'

const activityList = [{
  title: 'MVQ - Most Valuable Question ',
  period: 'One Week',
  rules: `
  📣 Got a pressing query about web3 (Layer2) that you're eager to get addressed? Hop onto our event and stand a chance to bag a reward! All you need to do is retweet the tweet linked above, @ three pals, and share that burning question you're dying to have answered about web3 (Layer2). The top 5 users with the most 'likes' on their comments will walk away with 10 USDT each! Don't wait – jump in now!
  `,
  award: 'Earn both QnA3 Credit and 10 USDT',
  url: 'https://twitter.com/qnaweb3/status/1668937240842760192',
  icon: 'https://0xfaqstorage.blob.core.windows.net/web-static/mvq_logo.png'
}]
export const ActivityContainer = () => {
  return (
    <div className=' bg-bg-50 md:rounded-2xl border-x-0 md:border-x p-4 md:px-6 border border-bg-200'>
      <div className='text-md text-white mb-4'>{t('activity.title')}</div>
      {activityList.map((i) => (
        <AcitivityItem data={i}/>
      ))}
    </div>
  )
}