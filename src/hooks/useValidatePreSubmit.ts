import useStore from '@store/store';
import { MessageInterface } from '@type/chat';
import { limitMessageTokens } from '@utils/messageUtils';


const useValidatePreSubmit = () => {

    const setToastStatus = useStore((state) => state.setToastStatus);
    const setToastMessage = useStore((state) => state.setToastMessage);
    const setToastShow = useStore((state) => state.setToastShow);

    const validateMessages = (messages: MessageInterface[]) => {
        
        /* Direct gets from the Store are generally not advised in React,
        but this is not a stateful rendered component, so it's fine here. */
        const generating = useStore.getState().generating;
        const currentChatIndex = useStore.getState().currentChatIndex;
        const currChats = useStore.getState().chats;

        try {
            if (generating) 
                throw new Error('Wrong state: already generating another response');

            if (!currChats) 
                throw new Error('Wrong state: chat not initialized');

            if (currChats[currentChatIndex].messages.length === 0)
                throw new Error('Wrong state: no messages submitted');

            /* Select context messages for submission */

            const maxPromptTokens = currChats[currentChatIndex].config.maxPromptTokens;
   
            const [limitedMessages, systemTokenCount, chatTokenCount, lastMessageTokens] = limitMessageTokens(
                messages,
                maxPromptTokens,
                currChats[currentChatIndex].config.model
            );

            //console.log ('Validate Messages: ', limitedMessages);
            
            if (limitedMessages.length <= 1) 
            {
                throw new Error(`Last Message tokens (${lastMessageTokens})\n+ System Prompt (${systemTokenCount})\nexceed Max Input tokens (${maxPromptTokens}).\n Can't send.`);
            } 

            return true;

        } catch (e: unknown) {

            const err = (e as Error).message;

            //console.log(err);
            //setError(err);

            setToastStatus('error');
            setToastMessage(err);
            setToastShow(true);

            return false;
        }
    };

    return { validateMessages };
};

export default useValidatePreSubmit;
