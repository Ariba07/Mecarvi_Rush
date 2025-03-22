import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import {styles} from '../../assets/styles/product/Product';

interface ImageSliderProps {
  productData: any; // Consider defining a more specific type for productData
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  productData,
  currentIndex,
  setCurrentIndex,
}) => {
  const goToNextImage = () => {
    setCurrentIndex(
      currentIndex < (productData?.size_variations.length || 0) - 1
        ? currentIndex + 1
        : 0,
    );
  };

  const goToPreviousImage = () => {
    setCurrentIndex(
      currentIndex > 0
        ? currentIndex - 1
        : (productData?.size_variations.length || 0) - 1,
    );
  };

  return (
    <View style={styles.imageSliderContainer}>
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={goToPreviousImage}>
        <Icon name="chevron-back" size={wp(5)} color={'grey'} type="ionicon" />
      </TouchableOpacity>
      <Image
        source={
          // productData && productData.size_variations.length > 0
          //   ? {uri: productData.size_variations[currentIndex]?.size_name}
          //   : {
          {
            uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
          }
        }
        style={styles.productImage}
      />
      <TouchableOpacity style={styles.navigationButton} onPress={goToNextImage}>
        <Icon
          name="chevron-forward"
          size={wp(5)}
          color={'grey'}
          type="ionicon"
        />
      </TouchableOpacity>
    </View>
  );
};

export default ImageSlider;
