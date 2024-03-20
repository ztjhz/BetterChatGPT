import ArrowBottom from '@icon/ArrowBottom';
import useStore from '@store/store';

const CollapseOptions = () => {
  const setHideMenuOptions = useStore((state) => state.setHideMenuOptions);
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);

  return (
    <div
      className={`fill-white hover:bg-gray-500/10 transition-colors duration-200 px-3 rounded-md cursor-pointer flex justify-center`}
      onClick={() => setHideMenuOptions(!hideMenuOptions)}
    >
      <ArrowBottom
        className={`h-3 w-3 transition-all duration-100 ${
          hideMenuOptions ? 'rotate-180' : ''
        }`}
      />
    </div>
  );
};

export default CollapseOptions;
