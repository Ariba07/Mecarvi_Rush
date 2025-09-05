import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DocumentPicker from 'react-native-document-picker';
import File from '../../assets/images/File.svg';
import {styles} from '../../assets/styles/product/Product';

interface FileUploaderProps {
  frontFile: any;
  setFrontFile: (file: any) => void;
  backFile: any;
  setBackFile: (file: any) => void;
  theme: any;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  frontFile,
  setFrontFile,
  backFile,
  setBackFile,
  theme,
}) => {
  const pickDocument = async (setFile: Function) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setFile(res);
    } catch (err) {
      console.log(
        DocumentPicker.isCancel(err)
          ? 'User cancelled'
          : 'Error picking document:',
        err,
      );
    }
  };

  return (
    <>
      <Text style={[styles.label, {color: theme.text}]}>
        Upload Logo/Artwork *
      </Text>
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => pickDocument(setFrontFile)}>
          {frontFile ? (
            <Image source={{uri: frontFile.uri}} style={styles.uploadedImage} />
          ) : (
            <>
              <File width={wp(10)} height={wp(10)} style={styles.fileIcon} />
              <Text style={[styles.uploadText, {color: theme.text}]}>
                Front Image *
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => pickDocument(setBackFile)}>
          {backFile ? (
            <Image source={{uri: backFile.uri}} style={styles.uploadedImage} />
          ) : (
            <>
              <File width={wp(10)} height={wp(10)} style={styles.fileIcon} />
              <Text style={[styles.uploadText, {color: theme.text}]}>
                Back Image *
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FileUploader;
