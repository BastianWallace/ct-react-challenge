import { createSlice } from '@reduxjs/toolkit'

const localStoredUser = JSON.parse(localStorage.getItem('currentUser'))

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: localStoredUser ? localStoredUser.email : null
  },
  reducers: {
    setActiveUser: (state, action) => {
      state.email = action.payload.email
      
    },
    setUserLogoutState: state => {
      state.email = null
      localStorage.removeItem('currentUser')
    }
  }
})

export default userSlice.reducer
export const { setActiveUser, setUserLogoutState } = userSlice.actions

// export const setCurrentUser = () => {
//   return (dispatch) => {
//     const setUser = async () => {
//       dispatch(
//         setActiveUser()
//       )
//     }

//     return setUser()
//   }
// }

//export const selectUserEmail = state => state.user.email

// export const useAuth = () => {
//   const [currentUser, setCurrentUser] = useState()

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user))
//     return unsub
//   }, [])

//   return currentUser
// }

// export const currentUser = (data) => {
//   return (dispatch) => {
//     const getUser = async () => {
//       dispatch(
//         setUserData({
//           ...data
//         })
//       )
//     }

//     onAuthStateChanged(auth, (user) => currentUser(user))
//     return getUser()
//   }
// }