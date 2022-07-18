import React, { useRef, useEffect } from 'react'
//import { signIn } from '../firebase-config'
// Redux
//import { setActiveUser } from '../store/slices/user'
//import { useDispatch, useSelector } from 'react-redux'

const SignInForm = () => {
  //const { loggedIn, email } = useSelector(state => state.user)
  //const dispatch = useDispatch()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSignIn = async () => {
    try {
      const result = await signIn(emailRef.current.value, passwordRef.current.value)
      
      if(result.user?.uid && result.user?.email) {
        localStorage.setItem('currentUser', JSON.stringify({uid: result.user.uid, email: result.user.email}))
      }

      // dispatch(setActiveUser({
      //   email: result.user.email
      // }))

    } catch (e) {
      alert(`Error: ${e}`)
    }
  }

  return (
    <div className="container pt-5">
      <div className="row justify-content-center">
        <div className="col-4">
          <div className="card p-4" style={{width: '100%'}}>
            <h2 className="text-center">Sign In</h2>
            <form>
              <div className="input-group mb-3">
                <span className="input-group-text d-inline-block" id="basic-addon1" style={{width: '40px'}}>@</span>
                <input type="text" name="username" className="form-control" placeholder="Email" ref={emailRef} aria-label="Email" aria-describedby="basic-addon1" />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text d-inline-block" id="basic-addon2" style={{width: '40px'}}>*</span>
                <input type="password" name="password" className="form-control" placeholder="Password" ref={passwordRef} aria-label="Password" aria-describedby="basic-addon2" />
              </div>
              <div className="text-center"><button type="button" className="btn btn-primary" onClick={handleSignIn}>Sign In</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInForm