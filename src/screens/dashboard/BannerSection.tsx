/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, FlatList, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {styles} from '../../assets/styles/dashboard/DashboardStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface Banner {
  id: string;
  image_url: string;
}

interface BannerSectionProps {
  banners: Banner[];
}

const BannerSection: React.FC<BannerSectionProps> = ({banners}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderBanner = ({item}: {item: Banner}) => (
    <Animatable.View animation="fadeIn" duration={800} delay={300}>
      <View style={styles.bannerContainer}>
        <Image
          source={{uri: item.image_url}}
          style={styles.banner}
          resizeMode="cover"
          onError={() => console.log(`Failed to load image: ${item.image_url}`)}
        />
      </View>
    </Animatable.View>
  );

  if (!banners || banners.length === 0) {
    return (
      <Animatable.View
        animation="slideInLeft"
        duration={1000}
        style={{marginHorizontal: hp('2%')}}>
        <View style={styles.bannerContainer}>
          <FastImage
            source={require('../../assets/images/No.gif')} // Single fallback GIF when no banners
            style={styles.banner}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </Animatable.View>
    );
  } else {
    return (
      <Animatable.View
        animation="slideInLeft"
        duration={1000}
        style={{marginHorizontal: hp('2%')}}>
        <FlatList
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={renderBanner}
          onScroll={event => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (wp('90%') + wp('2%') * 2),
            );
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
          snapToAlignment="center"
          decelerationRate="fast"
        />
        <View style={styles.dotContainer}>
          {banners.map((_, index) => (
            <Animatable.View
              key={index}
              animation={index === activeIndex ? 'bounceIn' : 'fadeIn'}
              duration={300}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex ? '#FF00A7' : '#cccccc',
                },
              ]}
            />
          ))}
        </View>
      </Animatable.View>
    );
  }
};

export default BannerSection;
