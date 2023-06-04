import { StoreSlice } from './store';
import { ChatInterface, FolderCollection, MessageInterface } from '@type/chat';
import { SearchResponseAggInterface, SearchLoadingAggInterface } from '@type/search';

export interface SearchSlice {
  response: SearchResponseAggInterface; 
  responseOrder: string[];
  searchLoading: SearchLoadingAggInterface;
  searchStatus: {
    [key: string]: {
      [key: string]: string|boolean;
    }
  },
  setResponse: (key: string, value: string) => void;
  setResponseOrder: (name: string) => void;
  setSearchLoading: (key: string, value: boolean) => void;
  clear: () => void;
  setSearchStatus: (key: string, event: string, value: string|boolean) => void
  getStatusByKey: (key: string) => string;
}

export const createSearchSlice: StoreSlice<SearchSlice> = (set, get) => ({
  response: {},
  responseOrder:[],
  searchLoading: {},
  searchStatus: {},
  getStatusByKey: (key: string) => {
    const status = get().searchStatus[key]?.currentEvent
    const responseText = get().response[key]
    const unUsefulState = status === 'done' && responseText === ''
    const doneState = status === 'done' && responseText !== '' 
    const loadingState = status === 'start' || responseText?.length < 5
    const messageState = status === 'message' && responseText && responseText?.length > 5
    let currentState = 'loading'
    if(unUsefulState){
      currentState = 'unUseful'
    }else if(doneState){
      currentState = 'done'
    }else if(loadingState){
      currentState = 'loading'
    }else if(messageState){
      currentState = 'message'
    }
    return currentState
  },
  setSearchStatus: (key: string, event: string, value: string|boolean) => {
    set((prev: SearchSlice) => ({
      ...prev,
      searchStatus: {
        ...prev.searchStatus,
        [key]: {
          ...prev.searchStatus[key],
          "currentEvent": event,
          [event]: value
        }
      },
    }));
  },
  setSearchLoading: (key: string, value: boolean) => {
    set((prev: SearchSlice) => ({
      ...prev,
      searchLoading: {
        ...prev.searchLoading,
        [key]: value
      },
    }));
  },
  setResponse: (key: string, value: string) => {
    set((prev: SearchSlice) => ({
      ...prev,
      response: {
        ...prev.response,
        [key]: value
      },
    }));
  },
  setResponseOrder: (name: string) => {
    set((prev: SearchSlice) => {
      const oldOrder = prev.responseOrder;
      if(!oldOrder.includes(name)) {
        return {
          ...prev,
          responseOrder: [...oldOrder, name],
        }
      }else{
        return prev;
      }
    });
  },
  clear: () => {
    set((prev: SearchSlice) => ({
      ...prev,
      response: {},
      responseOrder: [],
    }));
  }
});
