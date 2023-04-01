import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import useStore from '@store/store';

import SearchBar from '@components/SearchBar';

const ChatSearch = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [_filter, _setFilter] = useState<string>(filter);
  const generating = useStore((state) => state.generating);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _setFilter(e.target.value);
  };

  const debouncedUpdateFilter = useRef(
    debounce((f) => {
      setFilter(f);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedUpdateFilter(_filter);
  }, [_filter]);

  return (
    <SearchBar
      value={_filter}
      handleChange={handleChange}
      className='h-8 mb-2'
      disabled={generating}
    />
  );
};

export default ChatSearch;
