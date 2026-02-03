import { signalStore, withState } from '@ngrx/signals';

interface GroupListState {
  isLoading: boolean;
  error: string | null;
  groups: any[];
}

const initialState: GroupListState = {
  isLoading: false,
  error: null,
  groups: [],
};

export const GroupListStore = signalStore(withState(initialState));
