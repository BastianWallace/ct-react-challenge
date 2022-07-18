import { createSlice } from '@reduxjs/toolkit'

export const contentSlice = createSlice({
  name: 'content',
  initialState: {
    content: 'home'
  },
  reducers: {
    changeContent: (state, {payload}) => {
      state.content = payload
    }
  }
})

export default contentSlice.reducer
export const { changeContent } = contentSlice.actions
