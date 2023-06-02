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
}

export const createSearchSlice: StoreSlice<SearchSlice> = (set, get) => ({
  response: {},
  responseOrder:[],
  searchLoading: {},
  searchStatus: {},
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
