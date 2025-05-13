import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import CustomButton from '../../components/common/buttons/CustomButton';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {loginValidationSchema} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/login/LoginStyles';

interface LoginFormProps {
  onSubmit: (values: {email: string; password: string}) => void;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isChecked,
  setIsChecked,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={loginValidationSchema}
      onSubmit={onSubmit}>
      {({handleChange, handleSubmit, values, errors, touched}) => (
        <View>
          <Text style={[styles.label, {color: theme.text || '#333'}]}>
            Email
          </Text>
          <CustomTextInput
            placeholder="Email"
            value={values.email}
            onChangeText={text => handleChange('email')(text as string)}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          <Text style={[styles.label, {color: theme.text || '#333'}]}>
            Password
          </Text>
          <CustomTextInput
            placeholder="Password"
            secureTextEntry
            value={values.password}
            onChangeText={text => handleChange('password')(text as string)}
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <View style={styles.options}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsChecked(!isChecked)}>
              <View
                style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && (
                  <Icon
                    name="checkmark"
                    size={wp(3)}
                    color="#fff"
                    type="ionicon"
                  />
                )}
              </View>
              <Text
                style={[styles.rememberText, {color: theme.text || '#333'}]}>
                Remember me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
              <Text style={[styles.forgotText, {color: theme.text || '#333'}]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <CustomButton title="Login" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};

export default LoginForm;
