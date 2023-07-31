interface ClaimItemProps {
  available?: boolean;
}
export const ClaimItem = ({ available }: ClaimItemProps) => {
  return (
    <div
      className={`
    flex flex-col rounded-lg bg-gradient-to-b text-sm  text-gray-50 md:flex-row md:items-center md:justify-between
    ${available ? 'from-indigo-400 to-indigo-500' : 'from-gray-800 to-gray-900'}
    `}
    >
      <div className='p-4 pb-0 md:pb-4'>
        <p className='mb-2 font-bold'>Daily Activity：2023-06-07</p>
        <p>Ask 3 question to earn credits!</p>
      </div>
      <div className='p-4'>
        <div
          className={`
          cursor-pointer rounded-lg  p-2 text-center font-bold text-black ${
            available
              ? 'bg-indigo-200 hover:bg-indigo-300'
              : 'cursor-default bg-gray-500'
          }
        `}
        >
          {available ? `Claim 10 Credits` : 'CLAIMED'}
        </div>
      </div>
    </div>
  );
};

export const ClaimList = () => {
  return (
    <div>
      <div className='mb-4 font-bold text-white'>CREDITS CLAIM</div>
      <div className='flex flex-col gap-4'>
        <ClaimItem available />
        <ClaimItem available />
        <ClaimItem available={false} />
      </div>
    </div>
  );
};
