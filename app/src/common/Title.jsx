import {View, Text} from 'react-native';
import React from 'react';

const Title = ({text, color}) => {
  return (
    <Text
      style={{
        color: color,
        textAlign: 'center',
        fontSize: 48,
        fontFamily: 'LeckerliOne-Regular',
        marginBottom: 30,
      }}>
      {text}
    </Text>
  );
};

export default Title;
