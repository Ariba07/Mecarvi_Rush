import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type WorkItem = {
  id: string;
  image?: any; // Mark `image` as optional
};

const previousWorks: WorkItem[] = [
  {id: '1', image: require('../../../assets/images/Orders.png')},
  {id: '2', image: require('../../../assets/images/Orders.png')},
  {id: '3', image: require('../../../assets/images/Orders.png')},
  {id: '4', image: require('../../../assets/images/Orders.png')},
  {id: '5', image: require('../../../assets/images/Orders.png')},
];

const Work = () => {
  return (
    <View>
      <Text style={styles.title}>Previous Work</Text>

      <View style={styles.workListContainer}>
        <FlatList
          data={[...previousWorks, {id: 'add'}]} // Adding a plus button
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) =>
            item.id === 'add' ? (
              <TouchableOpacity style={styles.addButton}>
                <FontAwesome name="plus" size={wp(8)} color="#03A7A7" />
              </TouchableOpacity>
            ) : (
              <Image source={item.image} style={styles.workImage} />
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  workListContainer: {
    backgroundColor: '#fff',
    padding: wp(2),
    borderRadius: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
  workImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  addButton: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#03A7A7',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B8E6E6',
    borderStyle: 'dashed',
  },
});

export default Work;
