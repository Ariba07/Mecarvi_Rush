/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, TouchableOpacity, Image, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useDispatch} from 'react-redux';
import {setServiceUuid} from '../../slice/Slice';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {styles} from '../../assets/styles/dashboard/DashboardStyles';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface ServicesSectionProps {
  categories: Category[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({categories}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const {theme} = React.useContext(ThemeContext);

  return (
    <Animatable.View animation="fadeInUp" duration={1000}>
      <View style={styles.section}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.sectionTitle, {color: theme.text || '#333'}]}>
            Services
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Service')}>
            <Text style={{textDecorationLine: 'underline', color: '#FF00A7'}}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Animatable.View animation="zoomIn" duration={800} delay={200}>
              <TouchableOpacity
                style={[
                  styles.serviceCard,
                  {backgroundColor: theme.backgroundColor || '#fff'},
                ]}
                onPress={() => {
                  navigation.navigate('Products');
                  dispatch(setServiceUuid(item.id));
                }}>
                <Image
                  source={{uri: item.icon}}
                  style={styles.serviceImage}
                  resizeMode="contain"
                />
                <Text
                  style={[styles.serviceName, {color: theme.text || '#333'}]}
                  numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </Animatable.View>
  );
};

export default ServicesSection;
