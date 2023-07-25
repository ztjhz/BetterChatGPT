
interface ClaimItemProps {
  available?: boolean,
}
export const ClaimItem = ({available}:ClaimItemProps) => {
  return (
    <div className={`
    flex flex-col md:flex-row md:justify-between bg-gradient-to-b  text-gray-50 rounded-lg text-sm md:items-center
    ${available ? 'from-indigo-400 to-indigo-500' : 'from-gray-800 to-gray-900'}
    `}>
      <div className="p-4 pb-0 md:pb-4">
        <p className="font-bold mb-2">每日活跃：2023-06-07</p>
        <p>活动描述:xxxx</p>
      </div>
      <div className="p-4">
        <div className={`
          p-2 text-center  rounded-lg text-black font-bold cursor-pointer ${available ? 'bg-indigo-200 hover:bg-indigo-300' : 'bg-gray-500 cursor-default'}
        `}>
          {available ? `Claim 10 Credits` : 'CLAIMED'}
        </div>
      </div>
    </div>
  )
} 

export const ClaimList = () => {
  return (
    <div>
      <div className="text-white mb-4 font-bold">
          CREDITS CLAIM
      </div>
      <div className="flex flex-col gap-4">
          <ClaimItem available/>
          <ClaimItem available/>
          <ClaimItem available={false}/>
      </div>
    </div>
  )
}
