import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Formik} from 'formik';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {ThemeContext} from '../../context/ThemeContext';
import CustomButton from '../../components/common/buttons/CustomButton';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {loginValidationSchema} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/login/LoginStyles';

interface LoginFormProps {
  onSubmit: (values: {email: string; password: string}) => void;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isChecked,
  setIsChecked,
  isLoading,
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
          <Animatable.View animation="fadeIn" duration={800} delay={600}>
            <CustomTextInput
              placeholder="Email"
              value={values.email}
              onChangeText={text => handleChange('email')(text as string)}
            />
          </Animatable.View>
          {touched.email && errors.email && (
            <Animatable.Text
              animation="shake"
              duration={500}
              style={styles.errorText}>
              {errors.email}
            </Animatable.Text>
          )}
          <Text style={[styles.label, {color: theme.text || '#333'}]}>
            Password
          </Text>
          <Animatable.View animation="fadeIn" duration={800} delay={800}>
            <CustomTextInput
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={text => handleChange('password')(text as string)}
            />
          </Animatable.View>
          {touched.password && errors.password && (
            <Animatable.Text
              animation="shake"
              duration={500}
              style={styles.errorText}>
              {errors.password}
            </Animatable.Text>
          )}
          <Animatable.View animation="fadeIn" duration={800} delay={1000}>
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsChecked(!isChecked)}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: isChecked
                        ? theme.button
                        : theme.backgroundColor, // Slightly off-white for contrast
                      borderColor: theme.input,
                    },
                  ]}>
                  {isChecked && (
                    <Icon
                      name="checkmark"
                      size={wp(3.5)} // Slightly larger icon for visibility
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
                <Text
                  style={[styles.forgotText, {color: theme.text || '#333'}]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
          <Animatable.View animation="pulse" iterationCount={1} duration={1000}>
            <CustomButton
              title="Login"
              onPress={handleSubmit}
              disabled={isLoading}
            />
          </Animatable.View>
        </View>
      )}
    </Formik>
  );
};

export default LoginForm;
