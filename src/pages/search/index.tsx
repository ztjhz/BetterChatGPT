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