import React from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    phone: Yup.string().required('Phone is required'),
    pincode: Yup.string().required('Pincode is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleSignUp = async (values) => {
    const payload = {
      customerName: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      pincode: values.pincode,
      address: values.address,
    };

    try {
      const response = await fetch('https://localhost:8010/api/Customer/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      alert('Registration successful! Redirecting to login...');
      navigate('/login'); // redirect to login after successful signup
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Sign Up</Typography>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            pincode: '',
            address: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSignUp}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
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
              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Pincode"
                name="pincode"
                value={values.pincode}
                onChange={handleChange}
                error={touched.pincode && Boolean(errors.pincode)}
                helperText={touched.pincode && errors.pincode}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default SignUp;
