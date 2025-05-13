/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, FlatList, Image} from 'react-native';
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
    <View style={styles.bannerContainer}>
      <Image
        source={{uri: item.image_url}}
        style={styles.banner}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={{marginHorizontal: hp('2%')}}>
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
          <View
            key={index}
            style={[
              styles.dot,
              {backgroundColor: index === activeIndex ? '#FF00A7' : '#cccccc'},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerSection;
