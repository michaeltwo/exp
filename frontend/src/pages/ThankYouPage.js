import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Center, Spinner } from '@chakra-ui/react';

const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Redirect to home or another page
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Center minH="100vh">
      <Box textAlign="center" p={6} boxShadow="md" borderRadius="md">
        <Heading size="lg">Thank You for Your Participation!</Heading>
        <Text mt={4}>Your responses have been recorded successfully.</Text>
        <Spinner mt={4} />
        <Text mt={2}>Redirecting you in a few seconds...</Text>
      </Box>
    </Center>
  );
};

export default ThankYouPage;
