import SignInForm from '../components/SignInForm'
import { useSelector } from 'react-redux'

const Login = () => {
  return (
    <div className="container-xxl flex-wrap flex-lg-nowrap">
      <SignInForm />
    </div>
  )
}

export default Login