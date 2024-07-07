import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Button, FormControl, FormLabel, Image, Input, VStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

const Login = () => {
  const { login } = useAuth()
  const toast = useToast()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (username === '' || password === '') {
      toast({
        title: "Error",
        description: "Please enter your username and password",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return
    }
    try {
      setLoading(true)
      login(username, password)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Box as='form'
      onSubmit={handleLogin}
      p={4} maxW="md" mx="auto">
      <VStack spacing={4}>
        <Image src="https://looko-frontend-three.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLOOKO-LOGO.97b05474.png&w=256&q=75" alt="Looko" />
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          isLoading={loading}
          loadingText="Logging in"
          type="submit"
          colorScheme="blue">
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;