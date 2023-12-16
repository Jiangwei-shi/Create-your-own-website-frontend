import React, {useState} from 'react';
import {
  Avatar, Button, Container, FileInput, Flex, Group, Title, Text,
} from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from '@mantine/form';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import firebase from '../../firebaseConfig';
import {useNavigate} from 'react-router-dom';
import {updateUserThunk} from '../../services/authorize-thunk';

const PicturePage = () => {
  const [StylePhotoList, setStylePhotoList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);

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

  const handleStylePhotoChange = (index, e) => {
    const newStylePhoto = [...StylePhotoList];
    newStylePhoto[index] = e;
    setStylePhotoList(newStylePhoto);
  };

  const uploadStylePhoto = async (StylePhoto) => {
    if (!StylePhoto) return 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69';
    const storage = getStorage(firebase);
    const storageRef = ref(storage, 'stylePhoto/' + StylePhoto.name);
    await uploadBytes(storageRef, StylePhoto);
    return await getDownloadURL(storageRef);
  };


  const form = useForm({
    initialValues: {
      styleOnePhotos: user.styleOnePhotos || [],
    },
  });

  const handleSubmit = async (values) => {
    try {
      // eslint-disable-next-line max-len
      const avatarUrls = await Promise.all(StylePhotoList.map((StylePhoto) => uploadStylePhoto(StylePhoto)));
      const userData = {
        styleOnePhotos: avatarUrls.filter((url) => url !== undefined),
      };
      // Dispatch an update action
      const action = updateUserThunk({uid: user._id, userData});
      const resultAction = await dispatch(action);
      const updatedUser = resultAction.payload;
      console.log('Update successful: ', updatedUser);
      navigate('/dashBoard/music');
    } catch (error) {
      console.error('Update failed: ', error);
    }
  };

  const handleNumberOfPicture = (style) => {
    if (style === 'style 1') {
      return 1;
    } else if (style === 'style 2') {
      return 1;
    } else {
      return 3;
    }
  };

  const renderAvatarInputs = () => {
    const numberOfPictures = handleNumberOfPicture(user.websiteStyle);
    if (numberOfPictures === 0) {
      return <Text>This style does not require any pictures.</Text>;
    }
    let stylePhotoList;
    switch (user.websiteStyle) {
      case 'style 1':
        stylePhotoList = form.values.styleOnePhotos;
        break;
      case 'style 2':
        stylePhotoList = form.values.styleTwoPhotos;
        break;
    }

    const rows = [];
    for (let i = 0; i < numberOfPictures; i += 2) {
      rows.push(
          <Flex key={i} style={{marginTop: '1rem', gap: '1rem'}}>
            <Flex style={{flex: 1, alignItems: 'center', gap: '1rem'}}>
              <Avatar
                src={stylePhotoList[i] || 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69'}
                size="lg"
                radius="sm"
                style={{cursor: 'pointer', height: '100%'}}
                // onClick={() => handleAvatarClick(i)}
              />
              <FileInput
                clearable
                variant="filled"
                label={`Upload picture ${i + 1}`}
                placeholder=".jpg, .png are acceptable"
                accept="image/*"
                onChange={(e) => handleStylePhotoChange(i, e)}
                style={{flex: 1}}
              />
            </Flex>
            {i + 1 < numberOfPictures && (
              <Flex style={{flex: 1, alignItems: 'center', gap: '1rem'}}>
                <Avatar
                  src={stylePhotoList[i + 1] || 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69'}
                  size="lg"
                  radius="sm"
                  style={{cursor: 'pointer', height: '100%'}}
                  // onClick={() => handleAvatarClick(i + 1)}
                />
                <FileInput
                  clearable
                  variant="filled"
                  label={`Upload picture ${i + 2}`}
                  placeholder=".jpg, .png are acceptable"
                  accept="image/*"
                  onChange={(e) => handleStylePhotoChange(i + 1, e)}
                  style={{flex: 1}}
                />
              </Flex>
            )}
          </Flex>,
      );
    }
    return rows;
  };


  return (
    <Container size="md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
      {/* eslint-disable-next-line max-len */}
      <Title order={2} size="h1" style={{fontFamily: 'Greycliff CF, var(--mantine-font-family)'}} fw={900} ta="center">
        You selected {user.websiteStyle}
      </Title>
      <Text ta="center">
        You should upload {handleNumberOfPicture(user.websiteStyle)} picture(s)
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {renderAvatarInputs()}
        <Group justify="center" mt="xl">
          <Button type="submit" size="md">
            Next
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default PicturePage;

