import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';

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
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot: {docs: any[]}) => {
        const chatList: Chat[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Chat[];
        setChats(chatList);
      });

    return () => unsubscribe();
  }, []);

  const createChat = async () => {
    if (!chatName.trim()) {
      return;
    }

    await firestore().collection('chats').add({
      name: chatName,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    setChatName('');
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
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
