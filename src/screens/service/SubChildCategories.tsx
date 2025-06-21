import {
  Text,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useDispatch} from 'react-redux';
import {setServiceUuid} from '../../slice/Slice';
import * as Animatable from 'react-native-animatable';

type CategoryRouteProp = RouteProp<RootStackParamList, 'SubChildCategories'>;

const SubChildCategories: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CategoryRouteProp>();
  const {categoryId, categoryName} = route.params;
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();

  const perPage = 15;

  const fetchCategories = useCallback(
    async (pageNum: number) => {
      if (isLoading || !hasMore) {
        return;
      }
      setIsLoading(true);
      try {
        const response = (await apiHelper({
          method: 'GET',
          endpoint: `categories/?&per_page=${perPage}&page_id=${pageNum}&parent_uuid=${categoryId}`,
        })) as any;

        const activeCategories = response.data || [];
        const totalPages = response.meta?.pagination?.last_page || 1;

        setCategories(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newCategories = activeCategories.filter(
            (item: any) => !existingIds.has(item.id),
          );
          return [...prev, ...newCategories];
        });

        if (pageNum >= totalPages) {
          setHasMore(false);
        }
      } catch (error) {
        console.warn('Error fetching child categories:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [hasMore, isLoading, categoryId],
  );

  useEffect(() => {
    fetchCategories(page);
  }, [fetchCategories, page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleCategoryPress = (category: any) => {
    dispatch(setServiceUuid(category.id));
    navigation.navigate('Products');
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title={categoryName || 'Categories'}
          onBackPress={() => navigation.goBack()}
        />
        <FlatList
          data={categories}
          numColumns={3}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => (
            <Animatable.View
              animation="fadeInUp"
              duration={800}
              delay={index * 100}
              style={[
                styles.serviceCard,
                {backgroundColor: theme.backgroundColor},
              ]}>
              <TouchableOpacity onPress={() => handleCategoryPress(item)}>
                <Image
                  source={{uri: item.icon || 'https://via.placeholder.com/50'}}
                  style={styles.serviceImage}
                  resizeMode="contain"
                />
                <Text style={[styles.serviceName, {color: theme.text}]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator size="large" color={theme.text} />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  listContainer: {
    alignItems: 'center',
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp('1.5%'),
    width: wp('25%'),
    height: wp('25%'),
    justifyContent: 'center',
    margin: wp('3.5%'),
  },
  serviceImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2%'),
  },
  serviceName: {
    marginTop: hp('1%'),
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    maxWidth: wp('20%'),
  },
});

export default SubChildCategories;
