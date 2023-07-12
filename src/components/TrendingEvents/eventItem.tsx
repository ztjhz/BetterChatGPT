import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const EventItem = ({event}: any) => {
  const { t } = useTranslation();

  return (
      <li className="mb-6 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 dark:ring-gray-900 dark:bg-blue-900">
                <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                </svg>
            </span>
            <div className="flex justify-between">
              <p className="text-base font-normal mb-2 text-gray-400 ">{event?.event_title}</p>
              <time className=" text-sm font-normal leading-none text-gray-500 ">{moment(event?.event_date).utcOffset(0).format('HH:mm')}</time>
            </div>
            
            <p className="text-base font-normal mb-2 text-gray-400 ">{event?.event_text}</p>
            <Link to={`/search/${encodeURIComponent(event?.question)}/?origin_question=${encodeURIComponent(event?.origin_question)}`}>
              <h3 className="text-lg underline underline-offset-4 font-semibold text-white">{t('trendingNews.question')}{event?.question}</h3>
            </Link>
            
      </li>
  )
}