import React from 'react';
import {View, Image, TouchableOpacity, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import Video from 'react-native-video';
import {styles} from '../../assets/styles/product/Product';

interface ImageSliderProps {
  productData: any;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  productData,
  currentIndex,
  setCurrentIndex,
}) => {
  // Construct the media array: images + video (if available)
  const images = [
    productData?.featured_image, // String URL for featured image
    ...(productData?.additional_images?.map((img: any) => img?.file_url) || []), // Extract file_url from additional_images objects
  ].filter(Boolean);

  // Add video to the media array if it exists
  const video = productData?.video;
  const media = video ? [...images, {type: 'video', url: video}] : images;

  console.log('Media Array:', media); // Debug log to check media content

  const goToNextImage = () => {
    setCurrentIndex(currentIndex < media.length - 1 ? currentIndex + 1 : 0);
  };

  const goToPreviousImage = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : media.length - 1);
  };

  // Get screen dimensions for video sizing
  const {width} = Dimensions.get('window');
  const videoHeight = width * 0.6; // Adjust aspect ratio as needed (e.g., 16:9 or 4:3)

  return (
    <View style={styles.imageSliderContainer}>
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={goToPreviousImage}
        disabled={media.length <= 1}>
        <Icon name="chevron-back" size={wp(5)} color={'grey'} type="ionicon" />
      </TouchableOpacity>
      <Animatable.View
        animation="fadeIn"
        duration={600}
        key={currentIndex} // Key ensures animation retriggers on media change
        style={styles.productImage}>
        {media.length > 0 && media[currentIndex] ? (
          typeof media[currentIndex] === 'string' ? (
            // Render Image for image URLs
            <Image
              source={{uri: media[currentIndex]}}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            // Render Video for video URL
            <Video
              source={{uri: media[currentIndex].url}}
              style={[styles.productImage, {height: videoHeight}]}
              controls={false}
              resizeMode="contain"
              paused={false}
              repeat={false}
              onError={error => console.log('Video error:', error)}
              onLoad={() =>
                console.log('Video loaded:', media[currentIndex].url)
              }
            />
          )
        ) : (
          <Image
            source={{
              uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
            }}
            style={styles.productImage}
            resizeMode="contain"
          />
        )}
      </Animatable.View>
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={goToNextImage}
        disabled={media.length <= 1}>
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
