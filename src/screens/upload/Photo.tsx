import React from 'react';
import VerifyScreen from './VerifyScreen';

export const Photo = () => (
  <VerifyScreen
    title="Verify identity"
    label="Live Photo"
    imageSource={require('../../assets/images/live.png')}
  />
);
