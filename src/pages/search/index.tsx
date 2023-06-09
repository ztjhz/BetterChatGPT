import React, { useState } from "react"
import TextColorLogo from '@logo/textColor'
import TextColorLogoDark from '@logo/textColorDark'
import useStore from '@store/store';
import SearchInput from "@components/Search/searchInput";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TransparentHeader } from "@components/Header/transparent";


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
        <div className="w-full h-12 flex justify-center align-middle mb-6">
            {theme === 'dark' ? <TextColorLogoDark className="h-16"/> : <TextColorLogo className="h-16"/>}
            <div className="text-xs border border-emerald-600 rounded-full px-1 text-emerald-600 scale-75 -ml-2 self-end">ALPHA</div>
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