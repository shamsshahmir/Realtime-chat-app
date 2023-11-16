import {View, Text} from 'react-native';
import React from 'react';

const Cell = ({children}) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        height: 106,
      }}>
      {children}
    </View>
  );
};

export default Cell;
