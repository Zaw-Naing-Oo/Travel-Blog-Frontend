import React, { useState, useEffect, useRef } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
  MDBSpinner,
  MDBCardFooter,
  MDBIcon
}
from 'mdb-react-ui-kit';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { googleLogin, login, setUser } from '../redux/features/authSlice';
import { toast } from "react-toastify"
import { GoogleLogin } from '@react-oauth/google';
import  jwt_decode from 'jwt-decode'

const Login = () => {

  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });
  
  const [validationError, setValidationError] = useState({
    emailError: '',
    passwordError: '',
  });

  const submitButtonRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const { error, loading } = useSelector( state => ({...state?.auth}));

  const onChange = (e) => {
    if(formValue.email) {
      setValidationError({...validationError, emailError: ''});
    }
    if(formValue.password) {
      setValidationError({...validationError, passwordError: ''});
    }
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };


  useEffect(() => {
    error && toast.error(error);
  }, [error]);


  /* Form Validation */
  const validateForm = () => {
    let emailError = '';
    let passwordError = '';

    if (!formValue.email) {
      emailError = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValue.email)) {
      emailError = 'Invalid email address';
    }

    if (!formValue.password) {
      passwordError = 'Password is required';
    }

    if (emailError || passwordError) {
      setValidationError({ emailError, passwordError });
      return false;
    }

    setValidationError({ emailError: '', passwordError: '' });
    return true;
  };

  /* Submitting Form */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log(formValue);
      dispatch(login({formValue, navigate, toast }))
      setFormValue({ email: '', password: ''})
    }
  };

  /* Detect Enter key */
  const handleKeyDown = event => {
    if (event.key === "Enter") {
      submitButtonRef.current.click();
    }
  };


  return (
    <MDBContainer className='my-5 p-lg-5'>
      <MDBCard>

        <MDBRow className='g-0 d-flex align-items-center shadow-1-strong'>

          <MDBCol md='4'>
            <MDBCardImage src='https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg' alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
          </MDBCol>

          <MDBCol md='8'>

            <MDBCardBody className='p-5'>

            <h2 className="fw-bold mb-4 text-center">Signin now</h2>


              <form onSubmit={handleSubmit}>
                <MDBValidation>
                  <MDBValidationItem invalid="Please enter email">
                    <MDBInput
                      value={formValue.email}
                      wrapperClass=''
                      label='Email address'
                      id='validationCustom01'
                      type='email'
                      required
                      name='email'
                      onChange={onChange}
                      onKeyDown={handleKeyDown}
                      feedback='Please enter a valid email address'
                  />
                    <p className='error-message text-danger'>{validationError.emailError}</p>
                  </MDBValidationItem>

                  <MDBValidationItem className='mb-4' invalid="Please enter password">
                    <MDBInput
                      wrapperClass=''
                      label='Password'
                      id='validationCustom02'
                      type='password'
                      value={formValue.password}
                      name='password'
                      required
                      onChange={onChange}
                      onKeyDown={handleKeyDown}
                      feedback='Password must be at least 8 characters long'
                      autoComplete='off'
                    />
                    <p className='error-message text-danger'>{validationError.passwordError}</p>
                  </MDBValidationItem>
                </MDBValidation>

                <MDBBtn ref={submitButtonRef} className="mb-4 w-100" type='submit'>
                  { loading && <MDBSpinner style={{ width: '17px', height: '17px'}} role='status' size="sm" color="info" tag="span" className="me-2" /> }
                  Sign in
                </MDBBtn>
              </form>

              <div className="text-center">

                <p>or sign up with:</p>

                 {/* Google Login  */}
                  <div className='d-flex justify-content-center align-items-center'>
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      const token = credentialResponse?.credential;
                      const decodeGoogleToken = jwt_decode(token);
                      // console.log(formValue);
                      dispatch(googleLogin({decodeGoogleToken, navigate, toast }));
                    }}
                    shape="circle"
                    type='icon'
                    theme='outline'
                    logo_alignment='center'
                    onError={() => {
                      toast.error("Something is wrong")
                    }}
                  />
                  </div>
              </div>

            </MDBCardBody>

            <MDBCardFooter className='text-center'>
              <p className='d-inline me-2'>
                 Do not  have an account? 
                </p>
              <Link to="/register">
                Register
              </Link>
            </MDBCardFooter>

          </MDBCol>

        </MDBRow>

      </MDBCard>
    </MDBContainer>
  );
}

export default Login;

{/* <MDBContainer className="p-3 my-5 d-flex flex-column w-50"> */}
