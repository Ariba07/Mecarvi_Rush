import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {ImageData} from './types';
import {styles} from '../../assets/styles/verifyScreen/VerifyScreenStyles';

interface ImageCaptureProps {
  label: string;
  cnicImage: ImageData | null;
  cardImage: ImageData | null;
  photoImage: ImageData | null;
  imageSource: any;
  onCapture: () => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({
  label,
  cnicImage,
  cardImage,
  photoImage,
  imageSource,
  onCapture,
}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View>
      <Text style={[styles.label, {color: theme.text}]}>{label}</Text>
      <TouchableOpacity onPress={onCapture}>
        <View style={styles.box}>
          {label === 'CNIC Front Picture' && cnicImage ? (
            <Image source={{uri: cnicImage.uri}} style={styles.imagePreview} />
          ) : label === 'Credit Card Picture' && cardImage ? (
            <Image source={{uri: cardImage.uri}} style={styles.imagePreview} />
          ) : label === 'Live Photo' && photoImage ? (
            <Image source={{uri: photoImage.uri}} style={styles.imagePreview} />
          ) : (
            <Image style={styles.icon} source={imageSource} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ImageCapture;
