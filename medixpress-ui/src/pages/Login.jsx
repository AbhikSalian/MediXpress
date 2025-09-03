import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values) => {
  try {
    const response = await fetch('https://localhost:8010/api/Customer/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials or server error');
    }

    const data = await response.json();

    // Save to session storage
    sessionStorage.setItem('user', JSON.stringify(data));
// console.log(data);
    // Also update auth context
    login(data);

    navigate('/'); // Redirect to home after login
  } catch (error) {
    setErrorMsg(error.message || 'Login failed');
  }
};


  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Login
              </Button>
            </Form>
          )}
        </Formik>

        {/* Dev Login (still available) */}
        {/* <Button 
          variant="outlined" 
          color="secondary" 
          sx={{ mt: 2, ml: 2 }}
          onClick={() => {
            const fakeUser = {
              id: 99,
              name: 'Dev Tester',
              email: 'dev@medixpress.com',
            };
            login(fakeUser);
            navigate('/');
          }}
        >
          Dev Login
        </Button> */}
      </Box>
    </Container>
  );
}

export default Login;
