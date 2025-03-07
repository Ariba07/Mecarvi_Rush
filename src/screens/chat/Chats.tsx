import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Firebase imports (modular)
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {db} from '../../../FirebaseConfig';
import Header from '../../components/common/header/Header';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Message'>;

interface Chat {
  id: string;
  name: string;
}

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatName, setChatName] = useState('');
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'chats'), orderBy('createdAt', 'desc')),
      snapshot => {
        const chatList: Chat[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Chat[];
        setChats(chatList);
      },
    );

    return () => unsubscribe();
  }, []); // Removed db from dependencies

  const createChat = async () => {
    if (!chatName.trim()) {
      return;
    }

    await addDoc(collection(db, 'chats'), {
      name: chatName,
      createdAt: serverTimestamp(),
    });

    setChatName('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Messages" onBackPress={() => navigation.goBack()} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={chatName}
            onChangeText={setChatName}
            placeholder="Enter chat name"
          />
          <TouchableOpacity style={styles.button} onPress={createChat}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate('Message', {
                  chatId: item.id,
                  chatName: item.name,
                })
              }>
              <Text style={styles.chatName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6), // Slightly more padding on iOS
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  inputContainer: {flexDirection: 'row', marginBottom: 20},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  chatItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 8,
  },
  chatName: {fontSize: 16, fontWeight: 'bold'},
});

export default Chats;
