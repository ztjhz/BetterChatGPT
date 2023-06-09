import React, { useState } from "react"
import TextColorLogo from '@logo/textColor'
import TextColorLogoDark from '@logo/textColorDark'
import useStore from '@store/store';
import SearchInput from "@components/Search/searchInput";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TransparentHeader } from "@components/Header/transparent";
import QNALogo from "@logo/qnaLogo";


const SearchPage = () => {
  const [searchText, setSearchText] = useState('')
  const theme = useStore((state) => state.theme);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/search/' + searchText)
  }
  return (
    <div className="w-full min-h-full bg-gradient-to-t from-gray-100 to-gray-100/10">
      <TransparentHeader />
      <div
        className={`flex h-full flex-1 px-4 flex-col justify-center m-auto max-w-3xl md:max-w-3xl lg:max-w-3xl xl:max-w-5xl`}
      >
        <div className="w-full flex justify-center align-middle mb-6">
            <QNALogo className="w-40 h-40"/>
            <div className="text-xs border border-violet-800 rounded-full px-1 text-violet-800 mb-6 scale-75 -ml-2 self-end">ALPHA</div>
          </div>
          <SearchInput 
            value={searchText}
            setValue={setSearchText}
            handleSubmit={handleSubmit}
          />
      </div>
    </div>
  )
}

export default SearchPage