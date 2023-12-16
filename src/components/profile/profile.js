import {
  TextInput,
  Textarea,
  Group,
  Title,
  Button,
  Container,
  Flex,
  NativeSelect,
  Avatar,
  FileInput, Modal,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {Text} from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserThunk} from '../../services/authorize-thunk';
import firebase from '../../firebaseConfig';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const WelcomePage = () => {
  const [selfAvatar, setSelfAvatar] = useState(null);
  const [coupleAvatar, setCoupleAvatar] = useState(null);
  const [SelfViewerOpen, setSelfViewerOpen] = useState(false);
  const [CoupleViewerOpen, setCoupleViewerOpen] = useState(false);
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSelfAvatarChange = (e) => {
    setSelfAvatar(e);
  };

  const handleCoupleAvatarChange = (e) => {
    setCoupleAvatar(e);
  };
  const handleSelfAvatarClick= () => {
    setSelfViewerOpen(true);
  };
  const handleCoupleAvatarClick = () => {
    setCoupleViewerOpen(true);
  };

  const uploadSelfAvatar = async () => {
    if (!selfAvatar) return user.selfAvatarUrl;
    const storage = getStorage(firebase);
    const storageRef = ref(storage, 'avatars/' + selfAvatar.name);
    await uploadBytes(storageRef, selfAvatar);
    return getDownloadURL(storageRef);
  };


  const uploadCoupleAvatar = async () => {
    if (!coupleAvatar) return user.coupleAvatarUrl;
    const storage = getStorage(firebase);
    const storageRef = ref(storage, 'avatars/' + coupleAvatar.name);
    await uploadBytes(storageRef, coupleAvatar);
    return getDownloadURL(storageRef);
  };

  const form = useForm({
    initialValues: {
      selfAvatarUrl: user?.selfAvatarUrl || 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69',
      coupleAvatarUrl: user?.coupleAvatarUrl || 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69',
      selfFullName: user?.selfFullName || '',
      coupleFullName: user?.coupleFullName || '',
      dob: user?.dob || '',
      websiteStyle: user?.websiteStyle || '',
      bio: user?.bio || '',
    },
    validate: {
      selfFullName: (value) => value.trim().length < 2,
      coupleFullName: (value) => value.trim().length < 2,
    },
  });

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
  const handleSubmit = async (values) => {
    try {
      const selfAvatarUrl = await uploadSelfAvatar();
      const coupleAvatarUrl = await uploadCoupleAvatar();
      const userData = {
        selfAvatarUrl: selfAvatarUrl,
        coupleAvatarUrl: coupleAvatarUrl,
        selfFullName: values.selfFullName,
        coupleFullName: values.coupleFullName,
        dob: values.dob || '',
        websiteStyle: values.websiteStyle,
        bio: values.bio,
      };
      // Dispatch an update action - replace with the actual thunk if different
      const action = updateUserThunk({uid: user._id, userData});
      const resultAction = await dispatch(action);
      const updatedUser = resultAction.payload;
      console.log('Update successful: ', updatedUser);
      navigate('/dashBoard/picture');
      // alert('You already successfully saved!');
    } catch (error) {
      console.error('Update failed: ', error);
    }
  };
  return (
    <Container size="md" style={{marginTop: '1rem', marginBottom: '2rem'}}>
      <Modal opened={SelfViewerOpen}
        onClose={() => setSelfViewerOpen(false)} >
        <img src={form.values.selfAvatarUrl}
          alt="Avatar"
          style={{width: '100%'}}/>
      </Modal>
      <Modal opened={CoupleViewerOpen}
        onClose={() => setCoupleViewerOpen(false)} >
        <img src={form.values.coupleAvatarUrl}
          alt="Avatar"
          style={{width: '100%'}}/>
      </Modal>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title
          order={2}
          size="h1"
          style={{fontFamily: 'Greycliff CF, var(--mantine-font-family)'}}
          fw={900}
          ta="center"
        >
          basic information
        </Title>

        <Flex style={{marginTop: '1rem', gap: '1rem'}}>
          <Flex style={{flex: 1, alignItems: 'center', gap: '1rem'}}>
            <Avatar
              src={form.values.selfAvatarUrl}
              size="lg"
              radius="sm"
              style={{cursor: 'pointer', height: '100%'}}
              onClick={handleSelfAvatarClick}
            />
            <FileInput
              clearable
              variant="filled"
              label="upload your photo"
              placeholder=".jpg .Png are acceptable"
              accept="image/*"
              onChange={handleSelfAvatarChange}
              style={{flex: 1}}
            />
          </Flex>
          <Flex style={{flex: 1, alignItems: 'center', gap: '1rem'}}>
            <Avatar
              src={form.values.coupleAvatarUrl}
              size="lg"
              radius="sm"
              style={{cursor: 'pointer', height: '100%'}}
              onClick={handleCoupleAvatarClick}
            />
            <FileInput
              clearable
              variant="filled"
              label="upload your couple photo"
              placeholder=".jpg .Png are acceptable"
              accept="image/*"
              onChange={handleCoupleAvatarChange}
              style={{flex: 1}}
            />
          </Flex>
        </Flex>
        <Flex style={{marginTop: '1rem', gap: '1rem'}}>
          <TextInput
            label="Self Full Name"
            name="selfFullName"
            variant="filled"
            {...form.getInputProps('selfFullName')}
            style={{flex: 1}}
          />

          <TextInput
            label="Couple Full Name"
            name="coupleFullName"
            variant="filled"
            {...form.getInputProps('coupleFullName')}
            style={{flex: 1}}
          />
        </Flex>
        <Flex style={{marginTop: '1rem', gap: '1rem'}}>
          <TextInput
            label="Date of couple"
            name="dob"
            variant="filled"
            {...form.getInputProps('dob')}
            style={{flex: 1}}
          />
          <NativeSelect
            label="Website Style"
            name="websiteStyle"
            variant="filled"
            {...form.getInputProps('websiteStyle')}
            data={
              ['style 1', 'style 2', 'style 3']
            }
            style={{flex: 1}}
          />
        </Flex>

        <Textarea
          mt="md"
          label="bio"
          placeholder="Your message"
          maxRows={10}
          minRows={5}
          autosize
          name="bio"
          variant="filled"
          {...form.getInputProps('bio')}
        />

        <Group justify="center" mt="xl">
          <Button type="submit" size="md">
            Next
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default WelcomePage;
