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

const hotQuestion = [
  'What is LSDfi and what value does it provide to users?',
  'what is modular blockchain?',
  'What will change after EIP-4844?',
  'Why is Maverick more capital efficient than Uniswap?',
  'What are the four types of zkEVM?',
  'What are the differences between modular blockchain and monolithic blockchain? List the current players',
  'What are the recent news about Polygon in the past week?',
  'What are some recommended coins and reasons for investing with 1000 USD?',
  'Compare with ERC20、721、1155 and 3525'
]

const SearchPage = () => {
  const [searchText, setSearchText] = useState('')
  const theme = useStore((state) => state.theme);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/search/' + encodeURIComponent(searchText))
  }
  return (
    <div className="w-full flex flex-col min-h-full bg-gray-1000">
      <div>
        <TransparentHeader />
      </div>
      <div className="w-full flex justify-center text-white bg-bgColor items-center py-1 gap-2">
        <span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.58744 0.666748C8.97934 1.3801 9.22397 2.34076 9.22397 3.40422C9.22397 5.59982 8.19675 7.38023 6.92876 7.38023C5.94059 7.38023 5.10557 6.29166 4.78217 4.77354C3.63401 6.39506 2.66699 8.31584 2.66699 10.2169C2.66699 13.0428 5.16265 15.3334 8.24039 15.3334C11.3187 15.3334 13.8143 13.0428 13.8143 10.2169C13.8143 5.08361 8.7924 0.838165 8.58744 0.666748ZM8.28646 14.1105C6.40876 14.1105 5.84844 12.6566 5.94518 12.0702C6.13804 10.9017 7.29194 10.711 8.16351 10.711C10.2377 10.711 11.0728 8.55179 11.1221 7.99201C11.1221 7.99201 11.8689 14.1105 8.28646 14.1105Z" fill="white"/>
        </svg>
        </span>
        <span>
          {t('freetip')}
        </span>
      </div>
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
            <div className="mt-2 md:mt-10 bg-bg-50 md:rounded-2xl p-4 md:px-6 border border-bg-200">
              <div className="text-md text-white mb-4">
                {t('hotQuestion')}
              </div>
                {hotQuestion.map((item, index) => {
                  return (
                    <Link key={item} to={`/search/${encodeURIComponent(item)}`}>
                      <div className="justify-start border-b border-bg-100 py-4 md:py-4 hover:text-white text-bg-800 text-sm md:text-sm">
                        {item}
                      </div>
                    </Link>
                  )
                })}
            </div>
            <div className="mt-2 md:mt-10 w-full">
                <ActivityContainer />
                <div className="mt-4 md:mt-12">
                  <QNAFooter />
                </div>
            </div>
          </div>
          
      </div>
    </div>
  )
}

export default SearchPage