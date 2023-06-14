import React from 'react'
import { AcitivityItem } from './ActivityItem'
import { t } from 'i18next'

const activityList = [{
  title: 'The most wanted to know web3 (Layer2) question selection event.',
  period: 'One Week',
  rules: `
  📣 Got a pressing query about web3 (Layer2) that you're eager to get addressed? Hop onto our event and stand a chance to bag a reward! All you need to do is retweet the tweet linked above, @ three pals, and share that burning question you're dying to have answered about web3 (Layer2). The top 5 users with the most 'likes' on their comments will walk away with 10 USDT each! Don't wait – jump in now!
  `,
  award: 'Q&A3 Credit and 10 USDT',
  url: 'https://twitter.com/qnaweb3/status/1668937240842760192'
}]
export const ActivityContainer = () => {
  return (
    <div className='p-4 rounded-md bg-white'>
      <div className='text-sm text-gray-500 mb-2'>{t('activity.title')}</div>
      {activityList.map((i) => (
        <AcitivityItem data={i}/>
      ))}
    </div>
  )
}