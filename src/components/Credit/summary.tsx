import { renderExternalWallet, renderInternalWallet } from '@src/pages/credit';
import useStore from '@store/store';
import { useNavigate } from 'react-router-dom';

export const CreditSummary = () => {
  const claimHistory = useStore((state) => state.claimHistory);
  const shouldShowNew = claimHistory.some((item) => !item.claimed);
  const navigate = useNavigate();
  return (
    <div className='mb-4 hidden w-full flex-col gap-4 bg-bg-50 p-4 md:flex'>
      {renderInternalWallet()}
      <div className='relative z-0'>
        {shouldShowNew && (
          <span
            onClick={() => {
              navigate('/user/credit');
            }}
            className='absolute top-5 right-1 z-20 mr-2 animate-pulse cursor-pointer rounded-full bg-red-800 px-2.5 py-0.5 text-xs font-medium text-red-100 duration-1000 '
          >
            New
          </span>
        )}
        <div className='relative z-10'>{renderExternalWallet()}</div>
      </div>
    </div>
  );
};
