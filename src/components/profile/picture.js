import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useForm} from '@mantine/form';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import firebase from '../../firebaseConfig';
import {
  Avatar,
  Button,
  Container,
  FileInput,
  Flex,
  Group,
  Text,
  TextInput,
  Title,
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
      styleTwoPhoto: (user?.styleOnePhotos && user.styleOnePhotos.length > 0) ? user.styleOnePhotos : ['https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/stylePhoto%2FstyleTwoexample1.jpeg?alt=media&token=782b6614-0be4-451a-afa5-b6b37fc6e702', 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/stylePhoto%2FstyleTwoexample2.jpeg?alt=media&token=9988571a-10bf-4799-a64e-f415adfeec38', 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/stylePhoto%2FstyleTwoexample3.jpeg?alt=media&token=ccbbfc44-88e1-4717-840f-b315c0eca747', 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/stylePhoto%2FstyleTwoexample4.jpeg?alt=media&token=f8e45b8f-4f20-4826-ba7a-977d854e7234', 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/stylePhoto%2FstyleTwoexample5.jpeg?alt=media&token=0f934fd4-8267-41f4-bd7e-cc6bbe6f2ff2', 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/stylePhoto%2FstyleTwoexample6.jpeg?alt=media&token=7e49c37e-52e9-47dd-b282-744c01e650e4', 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/stylePhoto%2FstyleTwoexample7.jpeg?alt=media&token=daac4fb8-6637-44d6-aacf-364289aba5e9', 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/stylePhoto%2FstyleTwoexample8.jpeg?alt=media&token=2e28ae25-7aae-4503-b72a-5e5eb36d1535'],
      styleTwoText: (user?.styleOneText && user.styleOneText.length > 0) ?
        // eslint-disable-next-line max-len
        user.styleOneText : ['I LOVE YOU', '这就是我们的爱情故事', '同一个愿望,相爱.我爱你,至死不渝', '我们的相遇是意外的，但这是一个美丽幸福的意外，让我遇到了这么好的你', '莎士比亚说过：爱情是一种甜蜜的痛苦，但是我愿意忍受这种痛苦，莎士比亚还说过，世界上没有比服侍爱情更快乐的了，你愿不愿意享受这种快乐？当然你是愿意的~嘿嘿', '这并不是说长，它肯定是不是你在电影这几天看到的那种吻，但它妙在以自己的方式，和所有我能记得的时刻是，当我们的嘴唇感动，我知道记忆会永远持续下去', '多庆幸世界那么大能和你相恋， 好骄傲你是爱我的，就那么一个你我真的很珍惜， 所有...所有的一切我只想用一句英文告诉你， You are the apple of my eyes', '执子之手,与子携老'],
    },
  });

  const [stylePhotoList, setStylePhotoList] = useState(() => {
    switch (user.websiteStyle) {
      case 'style 1':
        return form.values.styleOnePhotos;
      case 'style 2':
        return form.values.styleTwoPhoto;
      default:
        return [];
    }
  });
  const [StyleTextList, setStyleTextList] = useState(() => {
    switch (user.websiteStyle) {
      case 'style 1':
        return form.values.styleOneText;
      case 'style 2':
        return form.values.styleTwoText;
      default:
        return [];
    }
  });

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
    if (!StylePhoto) return stylePhotoList[index];
    if (StylePhoto===stylePhotoList[index]) {
      return stylePhotoList[index];
    }
    try {
      const storage = getStorage(firebase);
      const storageRef = ref(storage, 'stylePhoto/' + StylePhoto.name);
      await uploadBytes(storageRef, StylePhoto);
      return await getDownloadURL(storageRef);
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
      let userData;
      switch (user.websiteStyle) {
        case 'style 1':
          userData = {
            styleOnePhotos: avatarUrls.filter((url) => url !== undefined),
            styleOneText: StyleTextList,
          };
          break;
        case 'style 2':
          userData = {
            styleTwoPhoto: avatarUrls.filter((url) => url !== undefined),
            styleTwoText: StyleTextList,
          };
          break;
        // Optionally, you can add a default case if needed
        default:
          // Default case logic here
          break;
      }
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
      return 8;
    } else {
      return 3;
    }
  };

  const renderAvatarInputs = () => {
    const numberOfPictures = handleNumberOfPicture(user.websiteStyle);
    if (numberOfPictures === 0) {
      return <Text>This style does not require any pictures.</Text>;
    }

    const rows = [];
    for (let i = 0; i < numberOfPictures; i++) {
      rows.push(
          <Flex key={i} style={{marginTop: '1rem', gap: '1rem'}}>
            <Flex style={{flex: 1, alignItems: 'center', gap: '1rem'}}>
              <Avatar
                src={stylePhotoList[i]}
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
