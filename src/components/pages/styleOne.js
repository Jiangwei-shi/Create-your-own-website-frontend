import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {findUserByIdThunk} from '../../services/website-thunk';
import './styleOne.css';

// eslint-disable-next-line require-jsdoc
function styleOne() {
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
    <div className="pink-background">
      <div id="frame">
        <div className="heart left"></div>
        <div className="heart right"></div>
        <div className="heart bottom"></div>
      </div>

      <b className="word">每次遇见{user.coupleFullName}都心跳加速!</b>

      <audio autoPlay loop id="audios" preload="auto">
        <source
          src={user.BackgroundMusic}/>
      </audio>

      {/* 在这里添加其他 JavaScript 或 Canvas 代码 */}
    </div>
  );
}

export default styleOne;
