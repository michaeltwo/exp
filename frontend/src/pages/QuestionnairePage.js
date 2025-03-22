import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Center, Spinner, useToast } from '@chakra-ui/react';
import { getQuestionnaire, submitAnswers } from '../services/api';
import QuestionnaireForm from '../components/QuestionnaireForm';

const QuestionnairePage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const data = await getQuestionnaire(videoId);
        if (data.length > 0) {
          setQuestionnaire(data[0]); // Extract first questionnaire object
        }
      } catch (error) {
        console.error('Error fetching questionnaire:', error);
        toast({ title: 'Error loading questionnaire', status: 'error', duration: 3000, isClosable: true });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaire();
  }, [videoId, toast]);

  const handleSubmit = async (answers) => {
    try {
      await submitAnswers(answers);
      toast({ title: 'Responses submitted successfully!', status: 'success', duration: 3000, isClosable: true });
      navigate('/thank-you'); // Redirect to the Thank You page
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast({ title: 'Failed to submit responses', status: 'error', duration: 3000, isClosable: true });
    }
  };

  if (loading) {
    return <Center><Spinner size="xl" /></Center>;
  }

  return (
    <Box maxW="800px" mx="auto" p={5}>
      {questionnaire ? <QuestionnaireForm questionnaire={questionnaire} onSubmit={handleSubmit} /> : <p>No questionnaire available</p>}
    </Box>
  );
};

export default QuestionnairePage;
