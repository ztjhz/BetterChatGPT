import { CopyIcon } from "@components/CopyIcon"
import { QNADialog } from "@components/Dialog"
import { TransparentHeader } from "@components/Header/transparent"
import { InformationIcon } from "@icon/InfomationIcon"
import useStore from "@store/store"
import { formatWalletAddress } from "@utils/wallet"
import { useState } from "react"
import { useAccount } from "wagmi"
import { ClaimList } from "./claimList"


export const CreditPage = () => {
  const { address } = useAccount()
  const credit = useStore((state) => state.credit);
  const user = useStore((state) => state.user);
  const [isCustodianDialogOpen, setIsCustodianDialogOpen] = useState(false)
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)

  return (
    <div className="w-full flex flex-col min-h-full bg-gray-1000">
      <div>
        <TransparentHeader />
      </div>
      <div className="p-4 h-full flex-1 md:px-4 flex-col w-full m-auto max-w-3xl md:max-w-3xl lg:max-w-3xl xl:max-w-5xl">
        <div className="text-white mb-4 font-bold">
          MY CREDIT
        </div>
        <div className="flex flex-col gap-4 md:flex-row mb-4">
          <div
            className="rounded-md bg-gradient-to-r from-gray-800 to-gray-900 p-4 md:flex-1"
          >
            <div className="flex gap-2 items-center mb-2">
              <p className="text-md font-bold text-left text-white">Custodian Wallet</p>
              <InformationIcon className="w-4 h-4 text-white cursor-pointer" onClick={() => setIsCustodianDialogOpen(true)}/>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <p className="text-sm text-left text-white">{formatWalletAddress(user?.internal_address as string)}</p>
                <CopyIcon 
                  text={address as string} 
                  className="text-white w-4 h-4 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm text-left text-white"><strong className="text-lg">{credit}</strong> Credit</p>
              </div>
            </div>
          </div>
          <div
            className="rounded-md bg-gradient-to-r from-violet-400 to-fuchsia-400 p-4 relative md:flex-1"
          >
            <div className="flex gap-2 items-center  mb-2">
              <p className="text-md font-bold text-left text-white">External Wallet</p>
              <InformationIcon className="w-4 h-4 text-white cursor-pointer" onClick={() => setIsWalletDialogOpen(true)}/>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <p className="text-sm text-left text-white">{formatWalletAddress(address as string)}</p>
                <CopyIcon 
                text={address as string} 
                className="text-white w-4 h-4 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm text-left text-white"><strong className="text-lg">100</strong> Credit</p>
              </div>
            </div>
          </div>
        </div>
        <ClaimList />
        <QNADialog isOpen={isCustodianDialogOpen} onClose={() => setIsCustodianDialogOpen(false)} title="托管钱包的积分怎么用？">
          <div className="text-white p-4 pb-6">
            <ul className="text-sm flex flex-col gap-2">
              <li>1. 提问消耗 1 积分</li>
              <li>2. 对答案的 Vote 获得 1 积分</li>
              <li>3. 免 Gas 费</li>
            </ul>
          </div>
        </QNADialog>
        <QNADialog isOpen={isWalletDialogOpen} onClose={() => setIsWalletDialogOpen(false)} title="外部钱包的积分怎么用？">
          <div className="text-white p-4 pb-6">
            <ul className="text-sm flex flex-col gap-2">
              <li>1. 参加 QnA3 官方网站的活动可获得积分</li>
              <li>2. 后续将支持将托管钱包中的积分转移到外部钱包中</li>
            </ul>
          </div>
        </QNADialog>
      </div>
   </div>
  ) 
 }