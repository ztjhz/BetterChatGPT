import React, { useEffect, useMemo, useState } from 'react';

const TokenCount = React.memo(() => {
  return (
    <div className='absolute top-[-16px] right-0'>
      <div className='text-xs italic text-gray-900 dark:text-gray-300'>
        Cost: $0
      </div>
    </div>
  );
});

export default TokenCount;
