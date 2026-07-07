import {createSlice} from "@reduxjs/toolkit"
const RegisterSlice=createSlice({
  name:"get/Registration",
  initialState:{
    registration:[],
    editId:null,
    editData:{}
  },
  reducers:{
    setRegistrationData:(state,action)=>{
      state.registration=action.payload;
    
    },
    addRegistrationData:(state,action)=>{
     state.registration.push(action.payload);
    },
    updateRegistrationData:(state,action)=>{
      const index = state.registration.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.registration[index] = action.payload;
      }
    },
    deleteRegistrationData:(state,action)=>{
      state.registration=state.registration.filter(
        (item) => item.id !== action.payload.id
      );
    },
    setEditId:(state,action)=>{
      state.editId=action.payload
      state.editData=state.registration.find((item)=>item._id===action.payload)

    },


  }
})

export const { setRegistrationData, addRegistrationData, updateRegistrationData, deleteRegistrationData, setEditId } = RegisterSlice.actions;
export default RegisterSlice.reducer;