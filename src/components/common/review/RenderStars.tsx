import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import React from 'react';
import {View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating); // Count full stars
  const hasHalfStar = rating % 1 !== 0; // Check for half-star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {[...Array(fullStars)].map((_, index) => (
        <Svg
          key={`full-${index}`}
          width={wp(4)}
          height={wp(4)}
          viewBox="0 0 24 24">
          <Path
            fill="#FFD700"
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          />
        </Svg>
      ))}

      {hasHalfStar && (
        <Svg key="half-star" width={wp(4)} height={wp(4)} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="halfGradient">
              <Stop offset="50%" stopColor="#FFD700" />
              <Stop offset="50%" stopColor="#D3D3D3" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#halfGradient)"
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          />
        </Svg>
      )}

      {[...Array(emptyStars)].map((_, index) => (
        <Svg
          key={`empty-${index}`}
          width={wp(4)}
          height={wp(4)}
          viewBox="0 0 24 24">
          <Path
            fill="#D3D3D3"
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          />
        </Svg>
      ))}
    </View>
  );
};
