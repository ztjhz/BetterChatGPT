import { t } from "i18next"
import { Link } from "react-router-dom"


export const AcitivityItem = ({data}: any) => {
  return (
    <Link className="text-white" to={data.url} target="_blank">
      <div className="flex gap-2 mb-2 p-4 rounded-xl text-md font-bold " style={{
        background: 'linear-gradient(84.26deg, #B946FF -14.68%, #7074E9 84.01%)'
      }}>
        <div>
          <img src={data.icon} width="50px" height="50px" />
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <span>
              {data.title}
            </span>
          </div>
          <div className="text-md rounded-full">
            <span>{data.award}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}