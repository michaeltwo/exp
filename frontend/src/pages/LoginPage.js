// src/pages/LoginPage.js
import React, { useContext, useState } from 'react';
import {
  Box, Heading, Input, Button, VStack, Text, Toast, Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values.username, values.password);
      
      if (result.success) {
        // Use the Toast component directly
        Toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Check if user has given consent
        const hasConsent = localStorage.getItem('consentGiven') === 'true';
        if (hasConsent) {
          navigate('/');
        } else {
          navigate('/consent');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Box maxW="500px" mx="auto" p={5}>
      <VStack spacing={8} align="stretch">
        <Heading>Log In</Heading>
        
        {error && (
          <Text color="red.500">{error}</Text>
        )}
        
        <Formik
          initialValues={{
            username: '',
            password: ''
          }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <VStack spacing={4} align="stretch">
                <Field name="username">
                  {({ field }) => (
                    <Box mb={4}>
                      <Text as="label" display="block" mb={2}>Username</Text>
                      <Input
                        {...field}
                        placeholder="Username"
                        isInvalid={errors.username && touched.username}
                      />
                      {errors.username && touched.username && (
                        <Text color="red.500" fontSize="sm">{errors.username}</Text>
                      )}
                    </Box>
                  )}
                </Field>
                
                <Field name="password">
                  {({ field }) => (
                    <Box mb={4}>
                      <Text as="label" display="block" mb={2}>Password</Text>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                        isInvalid={errors.password && touched.password}
                      />
                      {errors.password && touched.password && (
                        <Text color="red.500" fontSize="sm">{errors.password}</Text>
                      )}
                    </Box>
                  )}
                </Field>
                
                <Button
                  mt={6}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Log In
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Box>
  );
};

export default LoginPage;