import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const { OAuth2Client } = require('google-auth-library');

const Login = () => {
  const navigate = useNavigate();
  async function verify(clientId, jwtToken) {
    const oAuthClient = new OAuth2Client(clientId);
    // Call the verifyIdToken to
    // varify and decode it
    const ticket = await oAuthClient.verifyIdToken({
      idToken: jwtToken,
      audience: clientId,
    });

    // Get the JSON with all the user info
    const payload = ticket.getPayload();

    // This is a JSON object that contains
    // all the user info
    return payload;
  }
  const responseGoogle = async (response) => {
    const profileObj = await verify(response.clientId, response.credential);
    localStorage.setItem('user', JSON.stringify({ ...profileObj, googleId: response.clientId }));
    const { name, picture } = profileObj;
    const doc = {
      _id: response.clientId,
      _type: 'user',
      userName: name,
      image: picture,
    };
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" />
          </div>

          <div className="shadow-2xl">
            <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
              <GoogleLogin
                onSuccess={responseGoogle}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
