import React from 'react';
import {Text, TextInput} from 'react-native';
import {styles} from '../../assets/styles/product/Product';

interface OrderNotesProps {
  reviewText: string;
  setReviewText: (text: string) => void;
  theme: any;
}

const OrderNotes: React.FC<OrderNotesProps> = ({
  reviewText,
  setReviewText,
  theme,
}) => {
  return (
    <>
      <Text style={[styles.label, {color: theme.text}]}>Order Notes</Text>
      <TextInput
        style={[
          styles.input,
          {color: theme.input, backgroundColor: theme.backgroundColor},
        ]}
        placeholder="Write description"
        multiline
        value={reviewText}
        onChangeText={setReviewText}
        placeholderTextColor={'#9c9c9c'}
      />
    </>
  );
};

export default OrderNotes;
