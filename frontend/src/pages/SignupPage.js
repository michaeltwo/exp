// src/pages/SignupPage.js
import React, { useContext, useState } from 'react';
import {
  Box, Heading, Input, Button, VStack, Text, Toast, Select, Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../context/AuthContext';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  group: Yup.string()
    .required('Please select a group')
});

const SignupPage = () => {
  const { signup } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await signup({
        username: values.username,
        email: values.email,
        password: values.password,
        group: values.group
      });
      
      if (result.success) {
        // Use the Toast component directly
        Toast({
          title: 'Account created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/consent');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred during signup');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Box maxW="500px" mx="auto" p={5}>
      <VStack spacing={8} align="stretch">
        <Heading>Sign Up</Heading>
        
        {error && (
          <Text color="red.500">{error}</Text>
        )}
        
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            group: ''
          }}
          validationSchema={SignupSchema}
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
                
                <Field name="email">
                  {({ field }) => (
                    <Box mb={4}>
                      <Text as="label" display="block" mb={2}>Email</Text>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        isInvalid={errors.email && touched.email}
                      />
                      {errors.email && touched.email && (
                        <Text color="red.500" fontSize="sm">{errors.email}</Text>
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
                
                <Field name="confirmPassword">
                  {({ field }) => (
                    <Box mb={4}>
                      <Text as="label" display="block" mb={2}>Confirm Password</Text>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm password"
                        isInvalid={errors.confirmPassword && touched.confirmPassword}
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>
                      )}
                    </Box>
                  )}
                </Field>
                
                <Field name="group">
                  {({ field }) => (
                    <Box mb={4}>
                      <Text as="label" display="block" mb={2}>Select Group</Text>
                      <Select
                        {...field}
                        placeholder="Select group"
                        isInvalid={errors.group && touched.group}
                      >
                        <option value="Group1">Group 1</option>
                        <option value="Group2">Group 2</option>
                      </Select>
                      {errors.group && touched.group && (
                        <Text color="red.500" fontSize="sm">{errors.group}</Text>
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
                  Sign Up
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Box>
  );
};

export default SignupPage;