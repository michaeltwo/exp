// src/pages/HomePage.js
import React, { useContext, useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Button, Center, Spinner } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getExperiments } from '../services/api';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasConsent = localStorage.getItem('consentGiven') === 'true';
  
  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const data = await getExperiments();
        setExperiments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching experiments:', error);
        setLoading(false);
      }
    };
    
    if (user) {
      fetchExperiments();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  if (loading) {
    return (
      <Center h="calc(100vh - 100px)">
        <Spinner size="xl" />
      </Center>
    );
  }
  
  return (
    <Box maxW="800px" mx="auto" p={5}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Welcome to the Research Platform</Heading>
        
        {!user ? (
          <Box>
            <Text mb={4}>
              This platform is designed for participants in our research study. Please log in or sign up to continue.
            </Text>
            <Button as={RouterLink} to="/login" colorScheme="teal" mr={4}>
              Log In
            </Button>
            <Button as={RouterLink} to="/signup" colorScheme="teal" variant="outline">
              Sign Up
            </Button>
          </Box>
        ) : !hasConsent ? (
          <Box>
            <Text mb={4}>
              Before participating in the study, you need to review and sign the informed consent form.
            </Text>
            <Button as={RouterLink} to="/consent" colorScheme="teal">
              Review Informed Consent
            </Button>
          </Box>
        ) : experiments.length > 0 ? (
          <Box>
            <Text mb={4}>
              You're all set to participate in the experiment.
            </Text>
            <Button as={RouterLink} to={`/experiment/${experiments[0].id}`} colorScheme="teal">
              Start Experiment
            </Button>
          </Box>
        ) : (
          <Text>No experiments are currently available.</Text>
        )}
      </VStack>
    </Box>
  );
};
export default HomePage;