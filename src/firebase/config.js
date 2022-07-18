// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9XdTGVi3OtBNg_zq-xunT-PtCvf8lV1k",
  authDomain: "ct-challenge-d7d8e.firebaseapp.com",
  projectId: "ct-challenge-d7d8e",
  storageBucket: "ct-challenge-d7d8e.appspot.com",
  messagingSenderId: "273371709428",
  appId: "1:273371709428:web:7a8c033f5261459a1543a1",
  measurementId: "G-RNZ6QG2ZK2"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//export const auth = getAuth(app)
export const firebaseDB = getFirestore(app)

// export const signUp = (email, password) => {
//   return createUserWithEmailAndPassword(auth, email, password)
// }

// export const signIn = (email, password) => {
//   // signInWithEmailAndPassword(auth, email, password)
//   // .then(function(firebaseUser) {
//   //   return firebaseUser
//   // })
//   // .catch((error) => {
//   //   // Error Handling
//   //   return error
//   // });

//   return new Promise((resolve, reject) => {
    
//     signInWithEmailAndPassword(auth, email, password)
//     .then(result => {
//       resolve(true)
//     })
//     .catch((error) => {
//       // Error Handling
//       console.log(error.code)
//       let errorMsg = ''

//       switch (error.code) {
//         case 'auth/wrong-password':
//         case 'auth/user-not-found':
//         case 'auth/user-disabled':
//           errorMsg = 'Wrong email or passowrd'
//           break;
      
//         default:
//           errorMsg = 'Login failed, please try then or contact support'
//           break;
//       }
//       reject(errorMsg)
//     })
//   })
// }

// custom Hook
// export const useAuth = () => {
//   const dispatch = useDispatch()
//   //const [currentUser, setCurrentUser] = useState()
//   const currentUser = useSelector(state => state.user)

//   useEffect(() => {
//     //const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user))
//     const unsub = onAuthStateChanged(auth, (data) => {
//       if(data) {
//         dispatch(setActiveUser(data.reloadUserInfo))
//       } else {
//         dispatch(setUserLogoutState())
//       }
//     })
//     return unsub
//   }, [])

//   return currentUser
// }