import { t } from "i18next"
import { Link } from "react-router-dom"


export const AcitivityItem = ({data}: any) => {
  return (
    <div className="mb-2">
      <div className="text-md font-bold flex gap-2 items-center">
        <span>
          <Link className="text-violet-600 visited:text-violet-600" to={data.url} target="_blank">{data.title}</Link>
        </span>
      </div>
      <div className="text-xs flex items-center gap-1 max-w-fit bg-yellow-100 rounded-full p-1 px-3 mt-2">
        <span>💰</span>
        <span>{data.award}</span>
      </div>
      <div className="text-sm text-gray-800 mt-2">
        {data.rules}
      </div>
    </div>
  )
}