import React, { useRef, useEffect } from 'react'
import { signUp } from '../firebase-config'
// Redux
import { setActiveUser } from '../store/slices/user'
import { useDispatch, useSelector } from 'react-redux'

const SignUpForm = () => {
  //const { loggedIn, email } = useSelector(state => state.user)
  const emailRef = useRef()
  const passwordRef = useRef()
  const dispatch = useDispatch()

  const handleSignup = async () => {
    try {
      const result = await signUp(emailRef.current.value, passwordRef.current.value)
      localStorage.setItem('currentUser', JSON.stringify({uid: result.user.uid, email: result.user.email}))
      dispatch(setActiveUser({
        email: result.user.email
      }))
    } catch {
      alert('Error!')
    }
  }

  return (
    <div>
      <form>
        <input ref={emailRef} type="text" name="email" placeholder="Email"/>
        <input ref={passwordRef} type="password" name="password" placeholder="Password"/>
        <button type="button" onClick={handleSignup}>Sign Up</button>
      </form>
    </div>
  )
}

export default SignUpForm