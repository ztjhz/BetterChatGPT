import { request } from '@api/request';
import { StoreSlice } from './store';

interface AcitvityResponse {
  id: number;
  status: string;
  activity: Activity
}

interface Question {
  id: number;
  qs_id: number
  query: string;
  vote_num: number;
}
interface Activity{
  start_at: Date;
  end_at: Date;
  questions: Question[];
}

export interface ActivitySlice {
  currentActivity: AcitvityResponse | null;
  getCurrentActivity: () => Promise<void>;
}

export const createActivitySlice: StoreSlice<ActivitySlice> = (set, get) => ({
  currentActivity: null,
  getCurrentActivity: async () => {
    const {data} = await request.get('/activity/status')
    set((prev: ActivitySlice) => ({
      ...prev,
      currentActivity: data
    }));
  },
});
