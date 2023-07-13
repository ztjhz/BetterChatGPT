import React, { useState } from "react"
import TextColorLogo from '@logo/textColor'
import TextColorLogoDark from '@logo/textColorDark'
import useStore from '@store/store';
import SearchInput from "@components/Search/searchInput";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { TransparentHeader } from "@components/Header/transparent";
import QNALogo from "@logo/qnaLogo";
import { ActivityContainer } from "@components/Activities/ActivityContainer";
import { QNAFooter } from "@components/Footer";
import { FreeTip } from "@components/FreeTip";
import { TrendingEvents } from "@components/TrendingEvents";
import mixpanel from 'mixpanel-browser';

const SearchPage = () => {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    if(!searchText){
      return 
    }

    mixpanel.track('Search', {
      'question': searchText
    })
    
    navigate('/search/' + encodeURIComponent(searchText))
  }
  return (
    <div className="w-full flex flex-col min-h-full bg-gray-1000">
      <div>
        <TransparentHeader />
      </div>
      <FreeTip />
      <div
        className={`flex h-full flex-1 md:px-4 flex-col w-full m-auto max-w-3xl md:max-w-3xl lg:max-w-3xl xl:max-w-5xl`}
      >
          <div className="p-4 md:p-0 md:mt-10 bg-bg-50 md:bg-transparent">
            <SearchInput 
              value={searchText}
              setValue={setSearchText}
              handleSubmit={handleSubmit}
            />
          </div>
          <div className="flex flex-col">
            <TrendingEvents />
            <div className="mt-2 md:mt-10 w-full">
                <ActivityContainer />
                <div className="px-4 md:px-0 mt-4 md:mt-12">
                  <QNAFooter />
                </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default SearchPage