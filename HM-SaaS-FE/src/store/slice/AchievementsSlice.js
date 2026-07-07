import {createSlice} from "@reduxjs/toolkit"
const AchievementsSlice = createSlice({
  name: "achievement",
  initialState: {
    achievementData: [],
  },
  reducers: {
    setAchievementsData: (state, action) => {
      state.achievementData = action.payload;
    },
    addAchievementsData:(state,action)=>{
      state.achievementData.push(action.payload);
    },
    editAchievementsData:(state,action)=>{
        const index = state.achievementData.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.achievementData[index] = action.payload;
      } 
    },
    deleteAchievementData:(state,action)=>{
       state.achievementData = state.achievementData.filter(item => item._id !== action.payload);

    }

  },
});
export  const { setAchievementsData ,addAchievementsData,editAchievementsData,deleteAchievementData} = AchievementsSlice.actions;

export  default AchievementsSlice.reducer;
