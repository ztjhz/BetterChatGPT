import { QNADialog } from '@components/Dialog';
import { InformationIcon } from '@icon/InfomationIcon';
import PlusIcon from '@icon/PlusIcon';
import useStore from '@store/store';
import { useEffect, useState } from 'react';

export const CheckInModal = () => {
  const [open, setOpen] = useState(false);
  const getCheckinStatus = useStore((state) => state.getCheckinStatus);
  const checkinStatus = useStore((state) => state.checkinStatus);

  useEffect(() => {
    getCheckinStatus();
  }, [1]);
  return (
    <>
      <div
        className='flex cursor-pointer items-center justify-between gap-2 rounded-md rounded-tl-none rounded-tr-none border border-t-0 border-bg-200 bg-indigo-800 p-2 text-sm text-white hover:bg-indigo-900'
        onClick={() => setOpen(true)}
      >
        <div className='flex items-center gap-2'>
          <div>✨</div>
          <div>
            Ask 3 questions to earn credits: {checkinStatus.today_count}/3
          </div>
        </div>
        <div>
          <InformationIcon className='h-5 w-5' />
        </div>
      </div>
      <QNADialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title='每日提问挑战'
      >
        <div>
          <div className='flex gap-2 p-4'>
            <div className='relative flex flex-col overflow-hidden rounded-lg border'>
              <div className='absolute top-0 left-0'>
                <PlusIcon className='h-5 w-5 text-white' />
              </div>
              <div className='flex-1 p-4 text-2xl'>🖊️</div>
              <div className='w-full bg-gray-50 text-center'>+10</div>
            </div>
          </div>
          <div className='flex items-center justify-between border-t border-t-gray-700 p-4 py-2 text-sm text-white'>
            <div>✨ 今日提问挑战，已完成：{checkinStatus.today_count}/3</div>
            <div className='rounded-full border p-2 py-1 text-sm'>CLAIM</div>
          </div>
        </div>
      </QNADialog>
    </>
  );
};
