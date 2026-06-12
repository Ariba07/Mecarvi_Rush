import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {ThemeContext} from '../../context/ThemeContext';
import {styles} from '../../assets/styles/login/LoginStyles';

const FooterSection: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = React.useContext(ThemeContext);

  return (
    <View style={styles.footer}>
      <Text style={[styles.footerText, {color: theme.text || '#333'}]}>
        Don’t have an account?{' '}
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Register');
        }}>
        <Text style={styles.registerText}>Register here</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FooterSection;
