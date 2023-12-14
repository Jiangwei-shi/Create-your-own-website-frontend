import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {loginThunk} from '../../services/authorize-thunk';
import keelworksLog from '../../icons/keelworksIcon.svg';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Text,
  Anchor,
  // Divider,
  Group,
} from '@mantine/core';
// import {BrandGoogle} from 'tabler-icons-react';
import {IconAlertCircle} from '@tabler/icons-react';
/**
 * Login component for user authentication.
 *
 * This component allows users to log in to the application. It includes
 * input fields for username and password, and a submit button that triggers
 * the login process. The component also displays any login errors and provides
 * links for account creation and password recovery.
 *
 * @return {JSX.Element} The rendered login component.
 */
function Login() {
  // State hooks for managing user inputs and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Hooks for dispatching actions and navigating routes
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selector to access current user data from Redux store
  const user = useSelector((state) => state.currentUser);
  // Derived state to determine if the form is valid for submission
  const isFormValid = username.trim() !== '' && password.trim() !== '';

  useEffect(() => {
    if (user && user._id) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/dashBoard');
    } else if (user && user.error === 'User does not exist') {
      setError('user id or password does not match');
    }
  }, [user, navigate]);

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;
    setError(null);

    try {
      await dispatch(loginThunk({username, password}));
    } catch (error) {
      setError('User does not exist');
    }
  };

  return (
    <Container size={'xs'} p={60} my={32}
      style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', justifyContent: 'center',
        marginBottom: '30px'}}>
        <img src={keelworksLog} alt="Logo" style={{width: '70%'}} />
      </div>

      <Paper withBorder shadow="sm" p={40} my={30} radius="md">
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />}
            title="Sorry!" color="red">
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="you@mantine.dev"
            required
            value={username}
            onChange={handleUsernameChange}
          />
          <PasswordInput
            label="Password"
            mt={20}
            placeholder="Your password"
            required
            value={password}
            onChange={handlePasswordChange}
          />
          <Button fullWidth mt={40} type="submit" disabled={!isFormValid}>
            log in
          </Button>
        </form>
      </Paper>

      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" onClick={() => navigate('/signup')}>
          Create account
        </Anchor>
      </Text>
      {/* <Text color="dimmed" size="sm" align="center" mt={5}>
        <Anchor component="button" size="sm">
          Forgot password?
        </Anchor>
      </Text> */}
      {/* <Divider my="lg" label="or" labelPosition="center" /> */}
      <Group position="center">
        {/* <Button leftIcon={<BrandGoogle />} variant="white" align="center">
          Connect to google
        </Button> */}
      </Group>
    </Container>
  );
}

export default Login;

