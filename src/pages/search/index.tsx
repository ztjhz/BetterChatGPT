import React, { useState } from 'react';
import TextColorLogo from '@logo/textColor';
import TextColorLogoDark from '@logo/textColorDark';
import useStore from '@store/store';
import SearchInput from '@components/Search/searchInput';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { TransparentHeader } from '@components/Header/transparent';
import QNALogo from '@logo/qnaLogo';
import { ActivityContainer } from '@components/Activities/ActivityContainer';
import { QNAFooter } from '@components/Footer';
import { FreeTip } from '@components/FreeTip';
import { TrendingEvents } from '@components/TrendingEvents';
import mixpanel from 'mixpanel-browser';
import { CreditSummary } from '@components/Credit/summary';
import { RankPage } from '../activities/rank';
import { CheckInModal } from '@components/Search/checkInModal';

const SearchPage = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  const handleSubmit = () => {
    if (!searchText) {
      return;
    }

    mixpanel.track('Search', {
      question: searchText,
    });

    navigate('/search/' + encodeURIComponent(searchText));
  };
  return (
    <div className='flex min-h-full w-full flex-col bg-gray-1000'>
      <div>
        <TransparentHeader />
      </div>
      {/* <FreeTip /> */}
      <div
        className={`m-auto flex h-full w-full max-w-3xl flex-1 flex-col md:max-w-3xl md:px-4 lg:max-w-3xl xl:max-w-5xl`}
      >
        <div className='bg-bg-50 p-4 md:mt-10 md:bg-transparent md:p-0'>
          <SearchInput
            value={searchText}
            setValue={setSearchText}
            handleSubmit={handleSubmit}
          />
          <div>
            <CheckInModal />
          </div>
        </div>
        <div className='flex flex-col'>
          {/* <div className="mt-4">
              <ActivityContainer />
            </div> */}
          <div className='w-full'>
            <CreditSummary />
            <div className=' dark:border-gray-700'>
              <ul className='-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500 dark:text-gray-400'>
                <li className='mr-2'>
                  <a
                    href='#'
                    onClick={() => setCurrentTab(0)}
                    className={`group inline-flex items-center justify-center rounded-t-lg border-b-2 border-transparent p-4 ${
                      currentTab == 0
                        ? 'border-blue-600 font-bold text-indigo-400'
                        : ' border-b hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    Voting
                  </a>
                </li>
                <li className='mr-2'>
                  <a
                    href='#'
                    onClick={() => setCurrentTab(1)}
                    className={`group inline-flex items-center justify-center rounded-t-lg border-b-2 border-transparent p-4 
                    ${
                      currentTab === 1
                        ? 'border-blue-600 font-bold text-indigo-400'
                        : ' hover:text-gray-600 dark:hover:text-gray-300'
                    }
                    `}
                    aria-current='page'
                  >
                    Trending
                  </a>
                </li>
              </ul>
            </div>
            <div hidden={currentTab === 1}>
              <RankPage />
            </div>
            <div hidden={currentTab === 0}>
              <TrendingEvents />
            </div>
            <div className='mt-4 px-4 md:mt-12 md:px-0'>
              <QNAFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
