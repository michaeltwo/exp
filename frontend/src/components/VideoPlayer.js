// src/components/VideoPlayer.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, VStack, Text, useDisclosure, Modal,
  ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton,
  Button, HStack, Tooltip
} from '@chakra-ui/react';
import ReactPlayer from 'react-player';
import { updateVideoProgress, recordFootnoteInteraction } from '../services/api';

const VideoPlayer = ({ video, onComplete }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [activeFootnote, setActiveFootnote] = useState(null);
  const [footnoteModalOpen, setFootnoteModalOpen] = useState(false);
  const playerRef = useRef(null);
  const progressInterval = useRef(null);
  
  useEffect(() => {
    // Set up interval to update progress every 5 seconds
    progressInterval.current = setInterval(() => {
      if (playerRef.current && playing) {
        const currentSeconds = playerRef.current.getCurrentTime();
        updateVideoProgress(video.id, currentSeconds, false).catch(console.error);
      }
    }, 5000);
    
    return () => {
      clearInterval(progressInterval.current);
    };
  }, [video.id, playing]);
  
  useEffect(() => {
    // Check for footnotes at current time
    const currentFootnote = video.footnotes.find(footnote => {
      // If current time is within 0.5 seconds of the footnote timestamp
      return Math.abs(footnote.timestamp - currentTime) < 0.5;
    });
    
    if (currentFootnote && currentFootnote !== activeFootnote) {
      setActiveFootnote(currentFootnote);
    } else if (!currentFootnote) {
      setActiveFootnote(null);
    }
  }, [currentTime, video.footnotes, activeFootnote]);
  
  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };
  
  const handleDuration = (duration) => {
    setDuration(duration);
  };
  
  const handleFootnoteClick = (footnote) => {
    setPlaying(false);
    setActiveFootnote(footnote);
    setFootnoteModalOpen(true);
    recordFootnoteInteraction(footnote.id).catch(console.error);
  };
  
  const handleEndVideo = () => {
    updateVideoProgress(video.id, duration, true)
      .then(() => {
        if (onComplete) {
          onComplete();
        }
      })
      .catch(console.error);
  };
  
  const closeFootnoteModal = () => {
    setFootnoteModalOpen(false);
    setPlaying(true);
  };
  
  // Prevent screenshots
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent common screenshot shortcuts
      if (
        (e.key === 'PrintScreen') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.shiftKey && e.key === 'p') ||
        (e.metaKey && e.shiftKey && e.key === '3') ||
        (e.metaKey && e.shiftKey && e.key === '4')
      ) {
        e.preventDefault();
        alert('Screenshots are not allowed during the study');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <VStack w="full" spacing={4}>
      <Box position="relative" width="100%" maxW="960px">
        <ReactPlayer
          ref={playerRef}
          url={video.file}
          width="100%"
          height="auto"
          controls={true}
          playing={playing}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEndVideo}
          // Prevent seeking forward
          onSeek={(seconds) => {
            if (seconds > currentTime + 1) {
              playerRef.current.seekTo(currentTime);
            }
          }}
          config={{
            file: {
              tracks: video.subtitle_file ? [
                {
                  kind: 'subtitles',
                  src: video.subtitle_file,
                  srcLang: 'en',
                  default: true,
                }
              ] : [],
              forceVideo: true,
            }
          }}
        />
        
        {/* Footnote popup */}
        {activeFootnote && !footnoteModalOpen && (
          <Box
            position="absolute"
            bottom="10px"
            left="10px"
            bg="rgba(0, 0, 0, 0.75)"
            color="white"
            p={3}
            borderRadius="md"
            maxW="300px"
            onClick={() => handleFootnoteClick(activeFootnote)}
            cursor="pointer"
          >
            <Text fontWeight="bold">📝 Note:</Text>
            <Text>{activeFootnote.text}</Text>
            <Text fontSize="sm" color="teal.200">Click to learn more</Text>
          </Box>
        )}
      </Box>
      
      {/* Footnote Modal */}
      <Modal isOpen={footnoteModalOpen} onClose={closeFootnoteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Footnote</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {activeFootnote && (
              <>
                <Text fontWeight="bold" mb={2}>{activeFootnote.text}</Text>
                <Text>{activeFootnote.detailed_text}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={closeFootnoteModal}>
              Continue Watching
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
export default VideoPlayer;