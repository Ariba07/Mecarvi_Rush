import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import {ReviewItem} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/shopProfile/ShopProfileStyles';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  averageRating: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  averageRating,
}) => {
  const {theme} = React.useContext(ThemeContext);

  const renderReviewItem = (item: ReviewItem) => (
    <View
      key={item.id}
      style={[styles.reviewCard, {backgroundColor: theme.backgroundColor}]}>
      <Text style={[styles.reviewText, {color: theme.text}]}>
        Order #{item.order_id}: {item.comment}
      </Text>
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <Icon
            key={index}
            name="star"
            size={wp(3.5)}
            color={index < item.rating ? '#ffd700' : '#ddd'}
          />
        ))}
        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.text}]}>Reviews</Text>
        <View style={styles.reviewContent}>
          {reviews.length > 0 ? (
            reviews.map(renderReviewItem)
          ) : (
            <Text style={[styles.noReviewsText, {color: theme.text}]}>
              No reviews available
            </Text>
          )}
        </View>
      </View>
      <View style={styles.reviewSection}>
        <Text style={[styles.sectionTitle, {color: theme.text}]}>
          Average Rating
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingValue, {color: theme.text}]}>
            {averageRating}
          </Text>
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="star"
              size={wp(5)}
              color={index < Math.round(averageRating) ? '#ffd700' : '#ddd'}
            />
          ))}
        </View>
        <Text style={styles.reviewsText}>Reviews ({reviews.length})</Text>
      </View>
    </>
  );
};

export default ReviewsSection;
