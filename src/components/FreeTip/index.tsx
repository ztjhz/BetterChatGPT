import { useTranslation } from "react-i18next";

export const FreeTip = ()=> {
  const { t } = useTranslation();

  return (
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
  )
}