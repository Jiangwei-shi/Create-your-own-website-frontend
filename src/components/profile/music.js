import React, {useState} from 'react';
import {
  Button, Container, FileInput, Flex, Group, Title, Text,
} from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from '@mantine/form';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import firebase from '../../firebaseConfig';
import {useNavigate} from 'react-router-dom';
import {updateUserThunk} from '../../services/authorize-thunk';

const MusicPage = () => {
  const [Music, setMusic] = useState(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);

  const handleMusicChange = (e) => {
    setMusic(e);
  };

  const form = useForm({
    initialValues: {
      BackgroundMusic: user?.BackgroundMusic || 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/music%2F%E7%88%B1%E5%A6%82%E7%81%AB.mp3?alt=media&token=816b35c4-453c-4396-a4c3-aab3c990e4b3',
    },
  });

  const uploadBackgroundMusic = async () => {
    if (!Music) return form.values.BackgroundMusic;
    const storage = getStorage(firebase);
    const storageRef = ref(storage, 'music/' + Music.name);
    await uploadBytes(storageRef, Music);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const MusicUrls = await uploadBackgroundMusic();
      const userData = {
        BackgroundMusic: MusicUrls,
      };
      const action = updateUserThunk({uid: user._id, userData});
      const resultAction = await dispatch(action);
      const updatedUser = resultAction.payload;
      console.log('Update successful: ', updatedUser);
      setIsButtonVisible(true);
    } catch (error) {
      console.error('Update failed: ', error);
    } finally {
      setIsLoading(false);
    }
  };
  const prevStep = () => {
    navigate('/dashboard/picture');
  };
  const lookWebsite = () => {
    navigate(`/user/${user._id}/${user.websiteStyle}`);
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <Text align="center" size="xl">
          Welcome, Guest!
        </Text>
      </div>
    );
  }

  return (
    <Container size="md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
      {/* eslint-disable-next-line max-len */}
      <Title order={2} size="h1" style={{fontFamily: 'Greycliff CF, var(--mantine-font-family)'}} fw={900} ta="center">
        You selected {user.websiteStyle}
      </Title>
      <Text ta="center">
        You should upload 1 music song
      </Text>
      <Flex style={{flex: 1, alignItems: 'center', gap: '1rem'}}>
        <FileInput
          clearable
          variant="filled"
          label="upload your music"
          placeholder="upload your music"
          accept=".mp3, .wav, .aac"
          onChange={handleMusicChange}
          style={{flex: 1}}
        />
      </Flex>
      <form onSubmit={form.onSubmit(handleSubmit)}>

        <Group justify="center" mt="xl">
          <Button variant="default" size="md" onClick={prevStep}>
            Back
          </Button>
          {isLoading ? (
            <Button loading loaderProps={{type: 'dots'}}>Loading...</Button>
          ) : (
            <Button type="submit" size="md">submit</Button>
          )}
          {isButtonVisible && (
            <Button size="md" onClick={lookWebsite}>
              Look at my website
            </Button>
          )}
        </Group>
      </form>
    </Container>
  );
};

export default MusicPage;
