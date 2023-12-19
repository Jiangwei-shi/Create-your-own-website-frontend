import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useForm} from '@mantine/form';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import firebase from '../../firebaseConfig';
import {
  Avatar, Button, Container, FileInput,
  Group, Title, Text, TextInput, Flex,
} from '@mantine/core';
import {updateUserThunk} from '../../services/authorize-thunk';

const PicturePage = () => {
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      styleOnePhotos: (user?.styleOnePhotos && user.styleOnePhotos.length > 0) ? user.styleOnePhotos : ['https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69', 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69', 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69'],
      styleOneText: (user?.styleOneText && user.styleOneText.length > 0) ?
        user.styleOneText : ['111', '222', '333'],
    },
  });
  const [stylePhotoList, setStylePhotoList] =
    useState(form.values.styleOnePhotos);
  const [StyleTextList, setStyleTextList] = useState(form.values.styleOneText);
  const [isLoading, setIsLoading] = useState(false);

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
    const newStylePhoto = [...stylePhotoList];
    newStylePhoto[index] = e;
    setStylePhotoList(newStylePhoto);
  };

  const handleStyleTextChange = (index, e) => {
    const newText = e.target.value;
    const newStyleText = [...StyleTextList];
    newStyleText[index] = newText;
    setStyleTextList(newStyleText);
  };
  const uploadStylePhoto = async (StylePhoto, index) => {
    if (!StylePhoto) return form.values.styleOnePhotos;
    if (StylePhoto===form.values.styleOnePhotos[index]) {
      return form.values.styleOnePhotos[index];
    }
    try {
      const storage = getStorage(firebase);
      const storageRef = ref(storage, 'stylePhoto/' + StylePhoto.name);
      await uploadBytes(storageRef, StylePhoto);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error('Error in file upload:', error);
      return null; // 或根据需求返回适当的值或处理错误
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line max-len
      const avatarUrls = await Promise.all(stylePhotoList.map((StylePhoto, index) => uploadStylePhoto(StylePhoto, index)));
      console.log(avatarUrls);
      const userData = {
        styleOnePhotos: avatarUrls.filter((url) => url !== undefined),
        styleOneText: StyleTextList,
      };
      // Dispatch an update action
      const action = updateUserThunk({uid: user._id, userData});
      const resultAction = await dispatch(action);
      const updatedUser = resultAction.payload;
      console.log('Update successful: ', updatedUser);
      navigate('/dashboard/music');
    } catch (error) {
      console.error('Update failed: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    navigate('/dashboard/profile');
  };

  const handleNumberOfPicture = (style) => {
    if (style === 'style 1') {
      return 3;
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
    let photoList;
    switch (user.websiteStyle) {
      case 'style 1':
        photoList = form.values.styleOnePhotos;
        break;
      case 'style 2':
        photoList = form.values.styleTwoPhotos;
        break;
    }

    const rows = [];
    for (let i = 0; i < numberOfPictures; i++) {
      rows.push(
          <Flex key={i} style={{marginTop: '1rem', gap: '1rem'}}>
            <Flex style={{flex: 1, alignItems: 'center', gap: '1rem'}}>
              <Avatar
                src={photoList[i]}
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
            <TextInput
              size="sm"
              label={`Describe photo ${i + 1}`}
              variant="filled"
              onChange={(e) => handleStyleTextChange(i, e)}
              value={StyleTextList[i] || ''}
              style={{flex: 1}}
            />
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
          <Button variant="default" size="md" onClick={prevStep}>
            Back
          </Button>
          {isLoading ? (
            <Button loading loaderProps={{type: 'dots'}}>Loading...</Button>
          ) : (
            <Button type="submit" size="md">Next</Button>
          )}
        </Group>
      </form>
    </Container>
  );
};

export default PicturePage;
