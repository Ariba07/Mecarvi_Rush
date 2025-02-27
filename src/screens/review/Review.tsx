import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import {Svg, Path} from 'react-native-svg';
import CustomButton from '../../components/common/buttons/CustomButton';
import {TouchableWithoutFeedback} from 'react-native';

const Review = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const handleStarPress = (index: number) => {
    setRating(index);
  };

  const handleSubmit = () => {
    console.log('Rating:', rating);
    console.log('Review:', reviewText);
    // Implement API call or storage logic here
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="Review" onBackPress={() => navigation.goBack()} />

          {/* Profile Image & Name */}
          <View style={styles.profileContainer}>
            <Image
              source={require('../../assets/images/Orders.png')} // Replace with your image
              style={styles.profileImage}
            />
            <Text style={styles.storeName}>Creative Ink Solutions</Text>
            <Text style={styles.date}>Date: 02 March 2025</Text>
          </View>

          {/* Review Card */}
          <View style={styles.reviewCard}>
            <Text style={styles.ratingText}>
              {rating === 5
                ? 'Excellent'
                : rating === 4
                ? 'Good'
                : rating === 3
                ? 'Average'
                : rating === 2
                ? 'Fair'
                : rating === 1
                ? 'Poor'
                : 'Select Rating'}
            </Text>

            {/* Star Rating */}
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map(index => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleStarPress(index)}>
                  <Svg
                    width={wp(8)}
                    height={hp(4)}
                    viewBox="0 0 24 24"
                    fill={index <= rating ? '#FF0080' : '#DDD'}>
                    <Path d="M12 2l2.7 6.9H22l-5.6 4.5 2.1 7L12 16.2 5.5 20.4l2.1-7L2 8.9h7.3L12 2z" />
                  </Svg>
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Input */}
            <Text style={styles.inputLabel}>Write a Review</Text>
            <TextInput
              style={styles.input}
              placeholder="Write a thank you note"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
              placeholderTextColor={'#cccccc'}
            />
          </View>

          {/* Submit Button at Bottom */}
          <View style={styles.buttonContainer}>
            <CustomButton title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1, // Ensures full screen usage
    alignItems: 'center',
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(15),
    resizeMode: 'cover',
  },
  storeName: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginTop: hp(2),
  },
  date: {
    fontSize: wp(3.5),
    color: '#111111',
  },
  reviewCard: {
    width: wp(90),
    backgroundColor: '#FFF',
    padding: wp(5),
    borderRadius: 12,
  },
  ratingText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  inputLabel: {
    fontSize: wp(4),
    fontWeight: '500',
    marginBottom: hp(1),
  },
  input: {
    height: hp(10),
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: wp(2),
    fontSize: wp(3.5),
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    color: '#333',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes button to bottom
    width: '100%',
    paddingBottom: hp(2), // Adds spacing from bottom
  },
});

export default Review;
