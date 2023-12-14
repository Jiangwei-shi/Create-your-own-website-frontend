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
import {IconBrandLinkedin, IconFileCv} from '@tabler/icons-react';
import firebase from '../../firebaseConfig';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import React, {useState} from 'react';

const WelcomePage = () => {
  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const handleAvatarChange = (e) => {
    setAvatar(e);
  };
  const handleResumeChange = (e) => {
    setResume(e);
  };

  const handleAvatarClick = () => {
    setIsViewerOpen(true);
  };

  const uploadAvatar = async () => {
    if (!avatar) return user.avatarUrl;
    const storage = getStorage(firebase);
    const storageRef = ref(storage, 'avatars/' + avatar.name);
    await uploadBytes(storageRef, avatar);
    return getDownloadURL(storageRef);
  };

  const uploadResume = async () => {
    if (!resume) return user.resumeUrl;
    const storage = getStorage(firebase);
    const storageRef = ref(storage, 'resume/' + resume.name);
    await uploadBytes(storageRef, resume);
    return getDownloadURL(storageRef);
  };

  const form = useForm({
    initialValues: {
      avatarUrl: user?.avatarUrl || 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69',
      resumeUrl: user?.resumeUrl || '',
      firstname: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      profession: user?.profession || '',
      bio: user?.bio || '',
      experience: user?.experience|| '',
      location: user?.location || '',
      linkedin: user?.linkedin || '',
    },
    validate: {
      firstname: (value) => value.trim().length < 2,
      lastName: (value) => value.trim().length === 0,
      email: (value) => !/^\S+@\S+$/.test(value),
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
      const avatarUrl = await uploadAvatar();
      const resumeUrl = await uploadResume();
      const userData = {
        firstName: values.firstname,
        lastName: values.lastName,
        email: values.email,
        profession: values.profession,
        bio: values.bio,
        experience: values.experience,
        location: values.location,
        linkedin: values.linkedin,
        avatarUrl: avatarUrl,
        resumeUrl: resumeUrl,
      };
      // Dispatch an update action - replace with the actual thunk if different
      const action = updateUserThunk({uid: user._id, userData});
      const resultAction = await dispatch(action);
      const updatedUser = resultAction.payload;

      console.log('Update successful: ', updatedUser);
      // Additional actions after successful update can go here
      alert('You already successfully saved!');
    } catch (error) {
      console.error('Update failed: ', error);
      // Handle update error here
    }
  };
  return (
    <Container size="md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
      <Modal opened={isViewerOpen}
        onClose={() => setIsViewerOpen(false)} >
        <img src={form.values.avatarUrl} alt="Avatar" style={{width: '100%'}}/>
      </Modal>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title
          order={2}
          size="h1"
          style={{fontFamily: 'Greycliff CF, var(--mantine-font-family)'}}
          fw={900}
          ta="center"
        >
          your information
        </Title>

        <Flex style={{marginTop: '1rem', gap: '1rem'}}>
          <Flex style={{flex: 1, alignItems: 'center', gap: '1rem'}}>
            <Avatar
              src={form.values.avatarUrl}
              size="lg"
              radius="sm"
              style={{cursor: 'pointer', height: '100%'}}
              onClick={handleAvatarClick}
            />
            <FileInput
              clearable
              variant="filled"
              label="Change new photo"
              placeholder=".jpg .Png are acceptable"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{flex: 1}}
            />
          </Flex>
          <FileInput
            icon={<IconFileCv/>}
            clearable
            variant="filled"
            label="Attach your CV"
            placeholder="only .PDF acceptable"
            accept=".pdf"
            onChange={handleResumeChange}
            style={{flex: 1}}
          />
        </Flex>
        <Flex style={{marginTop: '1rem', gap: '1rem'}}>
          <TextInput
            label="FirstName"
            name="firstname"
            variant="filled"
            {...form.getInputProps('firstname')}
            style={{flex: 1}}
          />

          <TextInput
            label="LastName"
            name="lastName"
            variant="filled"
            {...form.getInputProps('lastName')}
            style={{flex: 1}}
          />
        </Flex>
        <Flex style={{marginTop: '1rem', gap: '1rem'}}>
          <TextInput
            label="Email"
            name="email"
            variant="filled"
            {...form.getInputProps('email')}
            style={{flex: 1}}
          />
          <NativeSelect
            label="Profession"
            name="profession"
            variant="filled"
            {...form.getInputProps('profession')}
            data={
              ['Instructional Designer', 'UI/UX Designer', 'Graphics Designer']
            }
            style={{flex: 1}}
          />
        </Flex>

        <Flex style={{marginTop: '1rem', gap: '1rem'}}>
          <NativeSelect
            label="Experience"
            name="experience"
            variant="filled"
            {...form.getInputProps('experience')}
            data={
              ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years']
            }
            style={{flex: 1}}
          />

          <TextInput
            label="Location"
            name="location"
            variant="filled"
            {...form.getInputProps('location')}
            style={{flex: 1}}
          />
        </Flex>
        <TextInput
          label="LinkedIn Profile URL"
          icon={<IconBrandLinkedin/>}
          mt="md"
          name="linkedin"
          variant="filled"
          {...form.getInputProps('linkedin')}
        />

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
            Submit
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default WelcomePage;
