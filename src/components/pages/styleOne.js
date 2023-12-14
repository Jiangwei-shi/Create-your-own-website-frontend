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

      <b className="word">每次遇见绮绮都心跳加速!</b>

      <audio autoPlay loop id="audios" preload="auto">
        <source
          src="http://m801.music.126.net/20231215052214/e2d9903f84b87a09decde1315e5cd8a9/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/22251250391/8f9c/05ed/9cb4/162ece8a56c5917e4dbecf2f7ad9eb97.mp3"/>
      </audio>

      {/* 在这里添加其他 JavaScript 或 Canvas 代码 */}
    </div>
  );
}

export default styleOne;
