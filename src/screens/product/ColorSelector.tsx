import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../assets/styles/product/Product';
import { getHexColor } from './utils';

interface ColorSelectorProps {
  colorOptions: string[];
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  theme: any;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colorOptions,
  selectedColor,
  setSelectedColor,
  theme,
}) => {
  return (
    <>
      {colorOptions.length > 0 && (
        <>
          <Text style={[styles.label, {color: theme.text}]}>Color *</Text>
          <View style={styles.colorOptionsContainer}>
            {colorOptions.map((color: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  {backgroundColor: getHexColor(color)},
                  selectedColor === color && styles.selectedBorder,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </>
      )}
    </>
  );
};

export default ColorSelector;
