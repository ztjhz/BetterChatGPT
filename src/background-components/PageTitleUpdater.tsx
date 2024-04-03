import { useEffect, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';


const PageTitleUpdater = () => {

    const chatNamesAsPageTitles = useStore((state) => state.chatNamesAsPageTitles);

    const currentChatIndex = useStore((state) => state.currentChatIndex);

    const chatTitles = useStore(
        (state) => state.chats?.map((chat) => chat.title),
        shallow
        );

    const companyName:string = import.meta.env.VITE_COMPANY_NAME || "";

    useEffect(() => {
        
        //console.debug("PageTitleUpdater useEffect invoked")

        if (chatNamesAsPageTitles && chatTitles && currentChatIndex !== undefined) {
            document.title = chatTitles[currentChatIndex]
        } else {
            document.title = `${companyName} Chatbot`
        }
    }, [chatNamesAsPageTitles, chatTitles, currentChatIndex]);

    return null;

};

export default PageTitleUpdater;
