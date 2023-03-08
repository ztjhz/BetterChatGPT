import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import useStore from '@store/store';

import CopyIcon from '@icon/CopyIcon';
import EditIcon2 from '@icon/EditIcon2';
import DeleteIcon from '@icon/DeleteIcon';
import TickIcon from '@icon/TickIcon';
import CrossIcon from '@icon/CrossIcon';
import RefreshIcon from '@icon/RefreshIcon';
import DownChevronArrow from '@icon/DownChevronArrow';

import useSubmit from '@hooks/useSubmit';

import { ChatInterface } from '@type/chat';

import PopupModal from '@components/PopupModal';

const MessageContent = ({
  role,
  content,
  messageIndex,
  sticky = false,
}: {
  role: string;
  content: string;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(sticky);

  return (
    <div className='relative flex flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]'>
      <div className='flex flex-grow flex-col gap-3'></div>
      {isEdit ? (
        <EditView
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          sticky={sticky}
        />
      ) : (
        <ContentView
          role={role}
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
        />
      )}
    </div>
  );
};

const ContentView = React.memo(
  ({
    role,
    content,
    setIsEdit,
    messageIndex,
  }: {
    role: string;
    content: string;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    messageIndex: number;
  }) => {
    const { handleSubmit } = useSubmit();

    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setChats = useStore((state) => state.setChats);
    const lastMessageIndex = useStore((state) =>
      state.chats ? state.chats[state.currentChatIndex].messages.length - 1 : 0
    );

    const handleDelete = () => {
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      updatedChats[currentChatIndex].messages.splice(messageIndex, 1);
      setChats(updatedChats);
    };

    const handleMove = (direction: 'up' | 'down') => {
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      const updatedMessages = updatedChats[currentChatIndex].messages;
      const temp = updatedMessages[messageIndex];
      if (direction === 'up') {
        updatedMessages[messageIndex] = updatedMessages[messageIndex - 1];
        updatedMessages[messageIndex - 1] = temp;
      } else {
        updatedMessages[messageIndex] = updatedMessages[messageIndex + 1];
        updatedMessages[messageIndex + 1] = temp;
      }
      setChats(updatedChats);
    };

    const handleRefresh = () => {
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      const updatedMessages = updatedChats[currentChatIndex].messages;
      updatedMessages.splice(updatedMessages.length - 1, 1);
      setChats(updatedChats);
      handleSubmit();
    };

    return (
      <>
        <div className='markdown prose w-full break-words dark:prose-invert dark'>
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[[rehypeKatex, { output: 'mathml' }]]}
            components={{
              code({ node, inline, className, children, ...props }) {
                if (inline) return <code>{children}</code>;
                let highlight;

                const match = /language-(\w+)/.exec(className || '');
                const lang = match && match[1];
                const isMatch = lang && hljs.getLanguage(lang);
                if (isMatch)
                  highlight = hljs.highlight(children.toString(), {
                    language: lang,
                  });
                else highlight = hljs.highlightAuto(children.toString());

                return (
                  <div className='bg-black rounded-md'>
                    <div className='flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans'>
                      <span className=''>{highlight.language}</span>
                      <button
                        className='flex ml-auto gap-2'
                        onClick={() => {
                          navigator.clipboard
                            .writeText(children.toString())
                            .then(() => {
                              setCopied(true);
                              setTimeout(() => setCopied(false), 3000);
                            });
                        }}
                      >
                        {copied ? (
                          <>
                            <TickIcon />
                            Copied!
                          </>
                        ) : (
                          <>
                            <CopyIcon />
                            Copy code
                          </>
                        )}
                      </button>
                    </div>
                    <div className='p-4 overflow-y-auto'>
                      <code
                        className={`!whitespace-pre hljs language-${highlight.language}`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(highlight.value, {
                              USE_PROFILES: { html: true },
                            }),
                          }}
                        />
                      </code>
                    </div>
                  </div>
                );
              },
              p({ className, children, ...props }) {
                return <p className='whitespace-pre-wrap'>{children}</p>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <div className='flex justify-end gap-2 w-full mt-2'>
          {isDelete || (
            <>
              {role === 'assistant' && messageIndex === lastMessageIndex && (
                <RefreshButton onClick={handleRefresh} />
              )}
              {messageIndex !== 0 && (
                <UpButton onClick={() => handleMove('up')} />
              )}
              {messageIndex !== lastMessageIndex && (
                <DownButton onClick={() => handleMove('down')} />
              )}

              <EditButton setIsEdit={setIsEdit} />
              <DeleteButton setIsDelete={setIsDelete} />
            </>
          )}
          {isDelete && (
            <>
              <button
                className='p-1 hover:text-white'
                onClick={() => setIsDelete(false)}
              >
                <CrossIcon />
              </button>
              <button className='p-1 hover:text-white' onClick={handleDelete}>
                <TickIcon />
              </button>
            </>
          )}
        </div>
      </>
    );
  }
);

const MessageButton = ({
  onClick,
  icon,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactElement;
}) => {
  return (
    <div className='text-gray-400 flex self-end lg:self-center justify-center gap-3 md:gap-4  visible'>
      <button
        className='p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible'
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  );
};

const EditButton = ({
  setIsEdit,
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return <MessageButton icon={<EditIcon2 />} onClick={() => setIsEdit(true)} />;
};

const DeleteButton = ({
  setIsDelete,
}: {
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <MessageButton icon={<DeleteIcon />} onClick={() => setIsDelete(true)} />
  );
};

const DownButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return <MessageButton icon={<DownChevronArrow />} onClick={onClick} />;
};

const UpButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <MessageButton
      icon={<DownChevronArrow className='rotate-180' />}
      onClick={onClick}
    />
  );
};

const RefreshButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return <MessageButton icon={<RefreshIcon />} onClick={onClick} />;
};

const EditView = ({
  content,
  setIsEdit,
  messageIndex,
  sticky,
}: {
  content: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const inputRole = useStore((state) => state.inputRole);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const [_content, _setContent] = useState<string>(content);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.shiftKey) && e.key === 'Enter') {
      e.preventDefault();
      if (sticky) {
        handleSaveAndSubmit();
        resetTextAreaHeight();
      } else handleSave();
    }
  };

  const handleSave = () => {
    if (sticky && _content === '') return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      updatedMessages.push({ role: inputRole, content: _content });
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      setIsEdit(false);
    }
    setChats(updatedChats);
  };

  const { handleSubmit } = useSubmit();
  const handleSaveAndSubmit = () => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      if (_content !== '') {
        updatedMessages.push({ role: inputRole, content: _content });
      }
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      updatedChats[currentChatIndex].messages = updatedMessages.slice(
        0,
        messageIndex + 1
      );
      setIsEdit(false);
    }
    setChats(updatedChats);
    handleSubmit();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <>
      <div
        className={`w-full ${
          sticky
            ? 'py-2 md:py-3 px-2 md:px-4 border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
            : ''
        }`}
      >
        <textarea
          ref={textareaRef}
          className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-7 w-full'
          onChange={(e) => {
            _setContent(e.target.value);
          }}
          value={_content}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
        ></textarea>
      </div>
      <div className='text-center mt-2 flex justify-center'>
        {sticky && (
          <button
            className='btn relative mr-2 btn-primary'
            onClick={handleSaveAndSubmit}
          >
            <div className='flex items-center justify-center gap-2'>
              Save & Submit
            </div>
          </button>
        )}

        <button
          className={`btn relative mr-2 ${
            sticky ? 'btn-neutral' : 'btn-primary'
          }`}
          onClick={handleSave}
        >
          <div className='flex items-center justify-center gap-2'>Save</div>
        </button>

        {sticky || (
          <button
            className='btn relative mr-2 btn-neutral'
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <div className='flex items-center justify-center gap-2'>
              Save & Submit
            </div>
          </button>
        )}

        {sticky || (
          <button
            className='btn relative btn-neutral'
            onClick={() => setIsEdit(false)}
          >
            <div className='flex items-center justify-center gap-2'>Cancel</div>
          </button>
        )}
      </div>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title='Warning'
          message='Please be advised that by submitting this message, all subsequent messages will be deleted!'
          handleConfirm={handleSaveAndSubmit}
        />
      )}
    </>
  );
};

export default MessageContent;
