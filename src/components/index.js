import React from 'react';
import NavigationSidebar from './navigation/navigation';
import StepperComponent from './profile/stepper';
import {Routes, Route} from 'react-router';
import ProfileComponent from './profile/profile';
import PictureComponent from './profile/picture';
import MusicComponent from './profile/music';
import {Flex} from '@mantine/core';

// eslint-disable-next-line require-jsdoc
function dashBoard() {
  return (
    <Flex style={{width: '100%'}}>
      <div style={{padding: '0', flex: 1}}>
        <NavigationSidebar/>
      </div>
      <div style={{flex: 5}}>
        <Flex direction="column" style={{width: '100%'}}>
          <div style={{padding: '0', flex: 1}}>
            <StepperComponent/>
          </div>
          <div style={{flex: 5}}>
            <Routes>
              <Route path='/' element={<ProfileComponent />} />
              <Route path='/profile' element={<ProfileComponent />} />
              <Route path='/picture' element={<PictureComponent />} />
              <Route path='/music' element={<MusicComponent />} />
            </Routes>
          </div>
        </Flex>
      </div>
    </Flex>
  );
}

export default dashBoard;
