import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {findUserByIdThunk} from '../../services/website-thunk';
import {
  Container, Flex,
  Text, Image, Button,
} from '@mantine/core';

// eslint-disable-next-line require-jsdoc
function UserPage() {
  const {userId} = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userById.user);
  const loading = useSelector((state) => state.userById.loading);

  useEffect(() => {
    if (userId) {
      dispatch(findUserByIdThunk(userId));
    }
  }, [userId, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Container size={'responsive'}
      style={{justifyContent: 'center', alignItems: 'center',
        width: '100vw', height: '100vh', display: 'flex',
        flexDirection: 'column'}}>
      <Text color="black" size="xl" align="center">
        {`${user.firstName.toUpperCase()}'S PORTFOLIO`}
      </Text>
      <Flex style={{marginTop: '1rem', gap: '1rem', height: 'auto'}}>
        <Container size={'responsive'}
          style={{flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'}}
        >
          <Image
            radius="md"
            fit="contain"
            src={user.avatarUrl}
            style={{width: '200px', height: '200px'}}
          />
        </Container>
        <Container size={'responsive'}
          style={{flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'}}
        >
          <Text color="black" size="xl" align="center">
            Hi,my name is
          </Text>
          <Text color="black" size="xl" align="center" fw={700}>
            {`${user.firstName} ${user.lastName} `}
          </Text>
          <Text color="black" size="xl" align="center">
            {`And I am a ${user.profession}`}
          </Text>
          <Button component="a" href={user.resumeUrl}
            target="_blank" rel="noopener noreferrer">
            Download resume
          </Button>
        </Container>
      </Flex>
    </Container>
  );
}

export default UserPage;
