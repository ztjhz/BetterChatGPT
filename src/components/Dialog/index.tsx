
import Modal from 'react-modal';

interface QNADialogProps {
  children: any,
  isOpen: boolean,
  onClose: () => void,
  title: string
}

export const QNADialog = ({children, isOpen, onClose, title}: QNADialogProps) => {
  return (
    <Modal
        isOpen={isOpen}
        onRequestClose={() => onClose()}
        contentLabel="Get Started!"
        style={{
          content: {
            border: 'none',
            background: 'transparent',
          },
          overlay: {
            background: 'rgba(0, 0, 0, 0.6)'
          }
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col gap-2 w-full md:max-w-md transform overflow-hidden rounded-xl bg-gray-850 text-left align-middle shadow-xl transition-all">
            <div className='text-sm text-white p-4 py-3 flex items-center justify-between border-b border-bg-100'>
                <span>{title}</span>
                <div className="cursor-pointer p-2" onClick={() => onClose()}>
                  <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.55709 5.9999L0.314454 1.75726L1.25726 0.814453L5.4999 5.05709L9.74254 0.814453L10.6854 1.75726L6.44271 5.9999L10.6854 10.2425L9.74254 11.1854L5.4999 6.94271L1.25726 11.1854L0.314453 10.2425L4.55709 5.9999Z" fill="white"/>
                  </svg>
                </div>
            </div>
            {children}
          </div>
        </div>
      </Modal>
  )
}