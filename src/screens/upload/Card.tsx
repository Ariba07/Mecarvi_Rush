import React from 'react';
import VerifyScreen from './VerifyScreen';

export const Card = () => (
  <VerifyScreen
    title="Verify identity"
    label="Credit Card Picture"
    imageSource={require('../../assets/images/card.png')}
  />
);
