import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {registerThunk} from '../../services/authorize-thunk';
import {useNavigate} from 'react-router-dom';
import {Container, Box, Text, Grid, TextInput, Button, Paper, Modal}
  from '@mantine/core';
/**
 * Sign up.
 *
 * @return {any} - Sign up
 */
function Signup() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });
  const {firstname, lastname, email, confirmEmail,
    password, confirmPassword} = formData;
  const [open, setOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email !== confirmEmail) {
      alert('Emails do not match.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const userData = {username: email, password,
      firstName: firstname, lastName: lastname};
    const action = registerThunk(userData);
    const resultAction = await dispatch(action);

    if (registerThunk.rejected.match(resultAction)) {
      const errorMessage = resultAction.error.message;
      setModalMessage(errorMessage === 'User already exist' ? 'The ' +
        'username has been used.' : 'Registration failed. Please try again.');
      setOpen(true);
    } else {
      setModalMessage('You have successfully registered.');
      setOpen(true);
    }
  };

  const inputStyle = {marginBottom: '12px'};

  return (
    <>
      <Container size="25rem" px={0}>
        <Box style={{marginTop: 80, display: 'flex', flexDirection: 'column',
          alignItems: 'center'}}>
          <Text fz="xl" fw={500} align="center">Sign up</Text>
          <Paper padding="md" style={{marginTop: '16px'}}>
            <form onSubmit={handleSubmit}>
              <Grid gutter="md">
                <Grid.Col span={6}>
                  <TextInput
                    autoComplete="fname"
                    required
                    autoFocus
                    id="firstname"
                    label="First Name"
                    placeholder="First Name*"
                    value={firstname}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    required
                    id="lastname"
                    label="Last Name"
                    autoComplete="lname"
                    placeholder="Last Name*"
                    value={lastname}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    required
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    placeholder="Email Address*"
                    value={email}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    required
                    id="confirmEmail"
                    label="Confirm Email Address"
                    autoComplete="confirm-email"
                    placeholder="Confirm Email Address*"
                    value={confirmEmail}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    required
                    type="password"
                    id="password"
                    label="Password"
                    autoComplete="new-password"
                    placeholder="Password*"
                    value={password}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    required
                    type="password"
                    id="confirmPassword"
                    label="Confirm Password"
                    autoComplete="new-password"
                    placeholder="Confirm Password*"
                    value={confirmPassword}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Grid.Col>
              </Grid>
              <Button type="submit" style={{width: '100%'}}>Sign Up</Button>
            </form>
          </Paper>
        </Box>
      </Container>
      <Modal opened={open} onClose={() => setOpen(false)} title={modalMessage}>
        <div style={{marginTop: '16px', display: 'flex',
          justifyContent: 'flex-end'}}>
          <Button onClick={() => {
            setOpen(false);
            if (modalMessage === 'You have successfully registered.') {
              navigate('/login');
            }
          }} autoFocus>
            Ok
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Signup;
