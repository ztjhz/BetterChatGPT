import { request } from '@api/request';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventItem } from './eventItem';

export const TrendingEvents = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(async () => {
      setLoading(true);
      const { data } = await request.get<any>(
        '/trending/daily_events?lang=' +
          (i18n.language === 'en' ? 'english' : 'chinese')
      );
      setData(data?.data);
      setLoading(false);
    }, 200);
  }, [i18n?.language]);

  return (
    <div className=' rounded-none bg-bg-50 p-4 md:rounded-lg md:px-6'>
      <div className='text-md mb-4 text-white'>{t('trendingEvent')}</div>

      <ol className='relative border-l border-gray-200 dark:border-gray-700'>
        {data.map((item: any) => {
          return <EventItem event={item} key={item.question} />;
        })}
      </ol>
    </div>
  );
};
