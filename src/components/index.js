import React from 'react';
import NavigationSidebar from './navigation/navigation';
import {Routes, Route} from 'react-router';
import ProfileComponent from './profile/profile';

// eslint-disable-next-line require-jsdoc
function dashBoard() {
  return (
    <div className="container-fluid row" style={{marginTop: '0'}}>
      <div className='col-3 col-md-2 col-lg-2 col-xl-2'
        style={{padding: '0'}}>
        <NavigationSidebar active='explore' />
      </div>
      <div className='col-9 col-md-10 col-lg-10 col-xl-10'
        style={{position: 'relative'}}>
        <Routes>
          <Route path='/' element={<ProfileComponent />} />
          <Route path='/profile' element={<ProfileComponent />} />
        </Routes>
      </div>
    </div>
  );
}

export default dashBoard;
