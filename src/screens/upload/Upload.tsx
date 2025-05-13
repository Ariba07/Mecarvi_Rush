import React from 'react';
import VerifyScreen from './VerifyScreen';

const Upload = () => (
  <VerifyScreen
    title="Verify identity"
    label="CNIC Front Picture"
    imageSource={require('../../assets/images/cnic.png')}
  />
);

export default Upload;
