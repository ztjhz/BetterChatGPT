import { QNADialog } from '@components/Dialog';
import { InformationIcon } from '@icon/InfomationIcon';
import PlusIcon from '@icon/PlusIcon';
import useStore from '@store/store';
import { useEffect, useState } from 'react';
import CrystalIcon from '@icon/crystals.png';
import CoinIcon from '@icon/CoinIcon';
import CheckIcon from '@icon/CheckIcon';

export const CheckInModal = () => {
  const [open, setOpen] = useState(false);
  const getCheckinStatus = useStore((state) => state.getCheckinStatus);
  const checkinStatus = useStore((state) => state.checkinStatus);

  useEffect(() => {
    getCheckinStatus();
  }, [1]);

  const renderF6 = (ind: number) => {
    const isDone = checkinStatus?.check_in_day
      ? checkinStatus?.check_in_day > ind
      : false;
    const isCurrentDay = checkinStatus?.check_in_day === ind;
    const styleMap = isDone
      ? {
          color: 'lime',
          gradient: 'bg-gradient-to-b from-lime-400 to-lime-600',
        }
      : {
          color: 'violet',
          gradient: 'bg-gradient-to-b from-violet-500 to-purple-500',
        };
    return (
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-lg border ${
          isCurrentDay ? 'border-2 border-violet-100' : ''
        } border-${styleMap.color}-400  bg-opacity-20 ${
          styleMap.gradient
        } pt-4`}
      >
        <div className='flex-1'>
          <div className='mb-2 flex items-center justify-center'>
            <img src={CrystalIcon} className='w-12' />
          </div>
          <div className='px-2'>
            <div className='relative w-full rounded-full bg-slate-700 bg-opacity-40 text-center text-xs text-white'>
              <div
                className='absolute'
                style={{
                  top: '-2px',
                  left: '-2px',
                }}
              >
                <CoinIcon className='h-5 w-5' />
              </div>
              <div
                className='ml-3'
                style={{
                  fontFamily: 'RussoOne',
                }}
              >
                +{2 * ind + 10}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex items-center justify-center  bg-${styleMap.color}-700 mt-1 py-1 text-sm text-white`}
        >
          {isDone ? (
            <CheckIcon className={`h-5 w-5 text-lime-200 `} />
          ) : (
            <div
              style={{
                fontFamily: 'RussoOne',
              }}
            >
              Day {ind + 1}
            </div>
          )}
        </div>
      </div>
    );
  };
  const renderLastDay = () => {
    const isDone = checkinStatus?.check_in_day === 7;
    const styleMap = isDone
      ? {
          color: 'lime',
          gradient: 'bg-gradient-to-b from-lime-400 to-lime-600',
        }
      : {
          color: 'violet',
          gradient: 'bg-gradient-to-b from-violet-500 to-purple-500',
        };
    return (
      <div
        className={`relative m-4 mt-0 flex flex-col overflow-hidden rounded-lg border border-violet-400 bg-opacity-20 ${styleMap.gradient} pt-4 md:mt-4 md:ml-0 md:flex-1`}
      >
        <div className='flex-1'>
          <div className='mb-2 flex items-center justify-center'>
            <img src={CrystalIcon} className='w-24 md:w-36' />
          </div>
          <div className='px-2'>
            <div className='relative w-full rounded-full bg-slate-700 bg-opacity-40 text-center text-xs text-white'>
              <div
                className='absolute'
                style={{
                  top: '-4px',
                  left: '-4px',
                }}
              >
                <CoinIcon className='h-10 w-10' />
              </div>
              <div className='px-4'>
                <div
                  className='ml-3 text-2xl'
                  style={{
                    fontFamily: 'RussoOne',
                  }}
                >
                  +72
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className='flex items-center justify-center py-1 text-sm text-white'
          style={{
            fontFamily: 'RussoOne',
          }}
        >
          {isDone ? (
            <CheckIcon className={`h-12 w-12 text-lime-200 `} />
          ) : (
            <div
              style={{
                fontFamily: 'RussoOne',
              }}
            >
              Day 7
            </div>
          )}
        </div>
      </div>
    );
  };
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
        dialogClassName='md:max-w-xl'
      >
        <div>
          <div className='flex flex-col md:flex-row'>
            <div className='grid flex-1 grid-cols-3 gap-2 p-4 md:pr-2'>
              {[0, 1, 2, 3, 4, 5].map(renderF6)}
            </div>
            {renderLastDay()}
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
