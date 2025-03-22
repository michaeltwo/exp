// src/components/NavBar.js
import React, { useContext } from 'react';
import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <Box bg="teal.500" p={4} color="white">
      <Flex maxW="1200px" mx="auto" align="center">
        <Heading size="md">Research Platform</Heading>
        <Spacer />
        
        {user ? (
          <Flex gap={4} align="center">
            <Box>{user.username} (Group: {user.group})</Box>
            <Button size="sm" onClick={logout} colorScheme="teal" variant="outline">
              Logout
            </Button>
          </Flex>
        ) : (
          <Flex gap={4}>
            <Button as={RouterLink} to="/login" colorScheme="teal" variant="outline" size="sm">
              Login
            </Button>
            <Button as={RouterLink} to="/signup" colorScheme="teal" variant="outline" size="sm">
              Sign Up
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
export default NavBar;