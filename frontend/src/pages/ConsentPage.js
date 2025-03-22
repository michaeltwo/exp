// src/pages/ConsentPage.js
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Heading, Text, VStack, Button, Checkbox,
  Center, Spinner, Toast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getExperiments } from '../services/api';

const ConsentPage = () => {
  const { user } = useContext(AuthContext);
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consentChecked, setConsentChecked] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        const data = await getExperiments();
        if (data.length > 0) {
          setExperiment(data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching experiment:', error);
        setLoading(false);
      }
    };
    
    if (user) {
      fetchExperiment();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const handleConsentSubmit = () => {
    if (consentChecked) {
      localStorage.setItem('consentGiven', 'true');
      // Use the Toast component directly
      Toast({
        title: 'Consent recorded',
        description: 'Thank you for providing your consent.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } else {
      Toast({
        title: 'Consent required',
        description: 'You must acknowledge that you have read and agree to the consent terms.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
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
        <Heading>Informed Consent</Heading>
        
        {experiment ? (
          <>
            <Box 
              p={5} 
              borderWidth="1px" 
              borderRadius="lg" 
              bg="gray.50" 
              maxH="500px" 
              overflowY="auto"
            >
              <Text whiteSpace="pre-wrap">{experiment.consent_text}</Text>
            </Box>
            
            <Checkbox 
              isChecked={consentChecked} 
              onChange={(e) => setConsentChecked(e.target.checked)}
              size="lg"
            >
              I have read and agree to the terms described above
            </Checkbox>
            
            <Button 
              colorScheme="teal" 
              onClick={handleConsentSubmit}
              isDisabled={!consentChecked}
            >
              Submit Consent
            </Button>
          </>
        ) : (
          <Text>No experiment information available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default ConsentPage;