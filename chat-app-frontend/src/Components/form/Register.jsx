
import '../../Styles/Auth.css'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useRef, useState } from 'react'
import { getRegisterMutation, getVerifyMutation } from '../../Hooks/useAuthMutation'

function Register({ isNext, setNext, isContinue, setContinue, }) {
  const [message, setMessage] = useState("")
  const [error, setError] = useState("") //pass & confirmPass Error

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")

  //otp ref
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);

  const useRegisterMutation = getRegisterMutation({ setContinue, setMessage, setName, setPassword });
  const useVerifyMutation = getVerifyMutation({ setMessage });


  const continueClickedHandler = (e) => {
    e.preventDefault()
    if (password !== conPassword) {
      setError(`"Password" and "Confirm Password" must be same!`);
      return
    }

    const data = {
      name,
      email,
      password
    }
    useRegisterMutation.mutate(data)

  }

  const handleChange = (e, nextRef) => {
    const value = e.target.value;
    // Allow only digits
    if (/^\d?$/.test(value)) {
      e.target.value = value;
      if (value.length === 1 && nextRef) {
        nextRef.current.focus();
      }
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const otp = input1Ref.current.value + input2Ref.current.value + input3Ref.current.value + input4Ref.current.value;
    useVerifyMutation.mutate({ otp, email })
  }

  return (

    <>
      {/* get name & email  */}
      {!isNext && !isContinue &&

        <form className="auth-form" onSubmit={() => setNext(true)}>
          <label htmlFor="name">Name<span>*</span></label>
          <input name='name' type="text" value={name} onChange={(e) => setName(e.target.value)} className="auth-name-input" placeholder='Enter your name' required />

          <label htmlFor="email">Email<span>*</span></label>
          <input name='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-email-input" placeholder='Enter your email address' required />
          <p className='formError'>{useRegisterMutation?.failureReason?.response?.data?.message}</p>
          <button type='submit' className="auth-login-button">Next<FaArrowRight /></button>
        </form>

      }
      {/* get password  */}
      {isNext && !isContinue && <>
        <h2 className="auth-greetings">Create Password</h2>

        <form className="auth-form" onSubmit={continueClickedHandler}>

          <label htmlFor="password">Password<span>*</span></label>
          <input name='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' required />

          <label htmlFor="confirmPassword">Confirm password<span>*</span></label>
          <input name='confirmPassword' type="password" value={conPassword} onChange={(e) => setConPassword(e.target.value)} placeholder='Enter your password' required />

          <p className='formError'>{error}</p>
          <p className='formError'>{useRegisterMutation?.failureReason?.response?.data?.message}</p>

          <div className="flex">
            <button type='button' className="auth-login-button" onClick={() => setNext(false)}><FaArrowLeft />Go back</button>
            <button type='submit' className="auth-login-button">Continue<FaArrowRight /></button>
          </div>
        </form>
      </>}

      {isNext && isContinue && <>
        <h2 className="auth-greetings">Verify Email</h2>
        <p className="auth-sub-greetings">{message}</p>
        <form className="auth-form" onSubmit={onSubmitHandler}>
          <label htmlFor="otp">Enter OTP<span>*</span></label>
          <div className="otp-inputs" >
            <input name='otp' type="String" ref={input1Ref} onChange={(e) => handleChange(e, input2Ref)} required maxLength="1" pattern="\d*" inputMode="numeric" className='otpInput' />
            <input name='otp' type="String" ref={input2Ref} onChange={(e) => handleChange(e, input3Ref)} required maxLength="1" pattern="\d*" inputMode="numeric" className='otpInput' />
            <input name='otp' type="String" ref={input3Ref} onChange={(e) => handleChange(e, input4Ref)} required maxLength="1" pattern="\d*" inputMode="numeric" className='otpInput' />
            <input name='otp' type="String" ref={input4Ref} onChange={(e) => handleChange(e, null)} required maxLength="1" pattern="\d*" inputMode="numeric" className='otpInput' />
          </div>
          <p className='formError'>{useVerifyMutation?.failureReason?.response?.data?.message}</p>

          <p className="auth-sub-greetings">OTP is valid for two minutes.</p>

          <button type='submit' className="auth-login-button" >Verify<FaArrowRight /></button>
        </form>
      </>}
    </>

  )
}

export default Register