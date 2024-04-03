import useStore from "@store/store";
import { ChatInterface } from "@type/chat";

/* 
    Purpose: synchronize "new message draft buffer" with Chat-level persisted state (chats[i].newMessageDraft)

    We only update the state.newMessageDraftbuffer while typing (see EditView.ts) for performance reasons,
    to avoid consty chats array serialization fron-to local store on each keypress.

    Then the buffer is synchronized with chat-level store on each Current Chat changes (see chat-slice.ts),
    and also on App startup (see App.ts).

    The newMessageDraftChatIndex indicates which Chat ID this draft buffer logically belongs to.
*/ 

export const handleNewMessageDraftBufferPersist = (whoCalled: string = "unknown") => {

    const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(useStore.getState().chats ?? []));
    const setChats = useStore.getState().setChats;

    const newMessageDraft = useStore.getState().newMessageDraftBuffer;
    const newMessageDraftChatIndex = useStore.getState().newMessageDraftChatIndex;

    if (updatedChats 
            && newMessageDraftChatIndex != undefined
            && newMessageDraftChatIndex >=0 
            && newMessageDraftChatIndex <= updatedChats.length - 1)
    {
        updatedChats[newMessageDraftChatIndex].newMessageDraft = newMessageDraft;    

        setChats(updatedChats);

        //console.debug(`handleNewMessageDraftBufferPersist (by ${whoCalled}): persisted buffer "${newMessageDraft}" for chatId= ${newMessageDraftChatIndex} title= ${updatedChats[newMessageDraftChatIndex].title}`);

    }
};


export const handleNewMessageDraftBufferRetrieve = (forced: boolean = false) => {

    const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(useStore.getState().chats ?? []));
 
    const newMessageDraftChatIndex = useStore.getState().newMessageDraftChatIndex;

    const currentChatIndex = useStore.getState().currentChatIndex;

    if (updatedChats
            && currentChatIndex >= 0
            && currentChatIndex <= updatedChats.length-1
            && (forced || currentChatIndex != newMessageDraftChatIndex))
        {
            const retrievedNewMessageDraft = updatedChats[currentChatIndex].newMessageDraft;

            useStore.getState().setNewMessageDraftBuffer(retrievedNewMessageDraft ?? "", currentChatIndex);

            //console.debug(`handleNewMessageDraftBufferRetrieve: retrieved buffer "${retrievedNewMessageDraft}" from chatId= ${currentChatIndex} title= ${updatedChats[currentChatIndex].title}`);
        }

};
