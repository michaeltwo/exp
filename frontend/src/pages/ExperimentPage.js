import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Heading, Text, VStack, Button, Center,
  Spinner, Flex, Badge, useToast, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getExperiment, getVideos } from '../services/api';
import VideoPlayer from '../components/VideoPlayer'; // Existing VideoPlayer component
import ConsentPage from './ConsentPage'; // Existing ConsentPage component

const ExperimentPage = () => {
  const { id } = useParams(); // Get experiment ID from URL params
  const { user } = useContext(AuthContext); // Access user data from AuthContext
  const [experiment, setExperiment] = useState(null); // State for experiment data
  const [videos, setVideos] = useState([]); // State for videos
  const [loading, setLoading] = useState(true); // State for loading status
  const [consentGiven, setConsentGiven] = useState(false); // State for consent status
  const [currentVideo, setCurrentVideo] = useState(null); // State for the currently selected video
  const navigate = useNavigate(); // Navigate to different routes
  const toast = useToast(); // Toast notifications

  // Fetch data when the component mounts or id changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch experiment and video data
        const experimentData = await getExperiment(id);
        const videosData = await getVideos();

        // Set the data into state
        setExperiment(experimentData);
        setVideos(videosData);
        setLoading(false); // Set loading to false once data is fetched

        // Check if the user has already given consent
        const consentStatus = localStorage.getItem('consentGiven') === 'true';
        setConsentGiven(consentStatus);
      } catch (error) {
        setLoading(false); // Set loading to false on error
        console.error('Error fetching experiment data:', error);

        // Show a toast notification for the error
        toast({
          title: 'Error fetching data',
          description: 'There was an error fetching the experiment and video data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [id, toast]); // Re-run the effect when `id` changes

  // Handle video selection
  const handleVideoSelect = (video) => {
    console.log('Selected video:', video); // Debug log
    setCurrentVideo(video); // Set the selected video
  };

  // Handle video completion
  const handleVideoComplete = () => {
    console.log('Video completed, redirecting to questionnaire...'); // Debug log
    toast({
      title: 'Video Completed',
      description: 'You have successfully watched the video.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    console.log('Redirecting to:', `/questionnaire/${currentVideo.id}`); // Debug log
    navigate(`/questionnaire/${currentVideo.id}`); // Redirect to questionnaire
  };

  // Redirect to a different page (e.g., Home) if experiment data is not found
  if (!experiment) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // If consent is not given, show the ConsentPage
  if (!consentGiven) {
    return <ConsentPage />;
  }

  return (
    <Box p={5}>
      {/* Display experiment title and description */}
      <VStack spacing={4} align="flex-start">
        <Heading>{experiment.title}</Heading>
        <Text>{experiment.description}</Text>
        <Badge colorScheme="teal">{experiment.status}</Badge>

        {/* Display experiment metadata, e.g., created date */}
        <Text fontSize="sm" color="gray.500">
          Created on: {new Date(experiment.created_at).toLocaleDateString()}
        </Text>

        {/* Show videos list */}
        <Heading size="md" mt={6}>Videos</Heading>
        <Flex wrap="wrap" gap={4}>
          {videos.length === 0 ? (
            <Text>No videos available for this experiment.</Text>
          ) : (
            videos.map((video) => (
              <Box key={video.id} p={3} borderWidth={1} borderRadius="md" boxShadow="sm" width="200px">
                <Heading size="sm" noOfLines={1}>{video.title}</Heading>
                <Text mt={2} fontSize="sm" noOfLines={2}>{video.description}</Text>
                <Button
                  mt={3}
                  colorScheme="blue"
                  onClick={() => handleVideoSelect(video)}
                >
                  Watch Video
                </Button>
              </Box>
            ))
          )}
        </Flex>
      </VStack>

      {/* Video Player Modal */}
      {currentVideo && (
        <Modal isOpen={!!currentVideo} onClose={() => setCurrentVideo(null)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{currentVideo.title}</ModalHeader>
            <ModalBody>
              <VideoPlayer
                video={currentVideo}
                onComplete={handleVideoComplete}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* If data is loading */}
      {loading && (
        <Center>
          <Spinner size="xl" />
        </Center>
      )}
    </Box>
  );
};

export default ExperimentPage;