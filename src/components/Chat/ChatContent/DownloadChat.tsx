import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import PopupModal from '@components/PopupModal';
import {
  chatToMarkdown,
  downloadImg,
  downloadMarkdown,
  downloadPDF,
  htmlToImg,
} from '@utils/chat';
import ImageIcon from '@icon/ImageIcon';
import PdfIcon from '@icon/PdfIcon';
import MarkdownIcon from '@icon/MarkdownIcon';
import JsonIcon from '@icon/JsonIcon';
import downloadFile from '@utils/downloadFile';
import { downloadFileInTauri, downloadPDFInTauri, htmlToImgInTauri, isTauri } from '@utils/tauri';

const DownloadChat = React.memo(
  ({ saveRef }: { saveRef: React.RefObject<HTMLDivElement> }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const getCurrentChat = () => {
      if (saveRef && saveRef.current) {
        const chats = useStore.getState().chats;
        if (!chats) return;
        return chats[useStore.getState().currentChatIndex];
      }
    };
    const getDefaultName = (chat = getCurrentChat()) => {
      if (!chat) return;
      return chat.title.trim() ?? 'download';
    };
    const clickDownloadImage = async () => {
      const defaultName = getDefaultName();
      if (!defaultName) return;
      const current = saveRef.current!;
      const ext = ".png";
      if (isTauri()) {
        try {
          const imgData = await htmlToImgInTauri(current);
          await downloadFileInTauri(imgData, defaultName, ext);
        } catch (err) {
          // TODO: handle error
          console.error(err);
        }
      } else {
        const imgData = await htmlToImg(current);
        downloadImg(imgData, `${defaultName}${ext}`);
      }
    };
    const clickDownloadMarkdown = async () => {
      const currentChat = getCurrentChat();
      if (!currentChat) return;
      const defaultName = getDefaultName(currentChat);
      if (!defaultName) return;
      const markdown = chatToMarkdown(currentChat);
      const ext = ".md";
      if (isTauri()) {
        try {
          await downloadFileInTauri(markdown, defaultName, ext);
        } catch (err) {
          // TODO: handle error
          console.error(err);
        }
      } else {
        downloadMarkdown(markdown, `${defaultName}${ext}`);
      }
    };
    const clickDownloadJSON = async () => {
      const currentChat = getCurrentChat();
      if (!currentChat) return;
      const defaultName = getDefaultName(currentChat);
      if (!defaultName) return;
      const ext = ".json";
      if (isTauri()) {
        try {
          await downloadFileInTauri(currentChat, defaultName, ext);
        } catch (err) {
          // TODO: handle error
          console.error(err);
        }
      } else {
        downloadFile([currentChat], `${defaultName}${ext}`);
      }
    };
    // TODO: At present, this feature is normal in both tauri and browser, but I did not handle the option 'electron', so it will only be enabled during tauri.
    const clickDownloadPDF = async () => {
      const currentChat = getCurrentChat();
      if (!currentChat) return;
      const defaultName = getDefaultName(currentChat);
      if (!defaultName) return;
      const imgData = await htmlToImg(saveRef.current!);
      const theme = useStore.getState().theme;
      if (isTauri()) {
        try {
          await downloadPDFInTauri(imgData, theme, defaultName);
        } catch (err) {
          // TODO: handle error
          console.error(err);
        }
      } else {
        downloadPDF(imgData, theme, `${defaultName}.pdf`);
      }
    };
    return (
      <>
        <button
          className='btn btn-neutral'
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {t('downloadChat')}
        </button>
        {isModalOpen && (
          <PopupModal
            setIsModalOpen={setIsModalOpen}
            title={t('downloadChat') as string}
            cancelButton={false}
          >
            <div className='p-6 border-b border-gray-200 dark:border-gray-600 flex gap-4'>
              <button
                className='btn btn-neutral gap-2'
                onClick={clickDownloadImage}
              >
                <ImageIcon />
                Image
              </button>
              {isTauri() ? <button
                className='btn btn-neutral gap-2'
                onClick={clickDownloadPDF}
              >
                <PdfIcon />
                PDF
              </button> : null}
              <button
                className='btn btn-neutral gap-2'
                onClick={clickDownloadMarkdown}
              >
                <MarkdownIcon />
                Markdown
              </button>
              <button
                className='btn btn-neutral gap-2'
                onClick={clickDownloadJSON}
              >
                <JsonIcon />
                JSON
              </button>
            </div>
          </PopupModal>
        )}
      </>
    );
  }
);

export default DownloadChat;
