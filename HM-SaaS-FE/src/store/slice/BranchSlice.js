import { createSlice } from '@reduxjs/toolkit';

const BranchSlice = createSlice({
  name: 'branch',
  initialState: {
    selectedBranch: null,
    tenantBranches: [],
  },
  reducers: {
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
    setTenantBranches: (state, action) => {
      state.tenantBranches = action.payload;
    },
  },
});

export const { setSelectedBranch, setTenantBranches } = BranchSlice.actions;
export default BranchSlice.reducer;
