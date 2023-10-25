import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Requests from './Requests';
import Friends from './Friends';
import Profile from './Profile';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
const Tab = createBottomTabNavigator();

const Home = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        headerLeft: () => (
          <View style={{marginLeft: 16}}>
            <Image
              source={require('../assets/profile.png')}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#e0e0e0',
              }}
            />
          </View>
        ),
        headerRight: () => {
          return (
            <TouchableOpacity>
              <FontAwesomeIcon
                style={{marginRight: 16}}
                icon="magnifying-glass"
                size={22}
                color="#404040"
              />
            </TouchableOpacity>
          );
        },
        tabBarIcon: ({focused, color, size}) => {
          const icons = {
            Requests: 'bell',
            Friends: 'inbox',
            Profile: 'user',
          };
          const icon = icons[route.name];
          return <FontAwesomeIcon icon={icon} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#202020',
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="Requests" component={Requests} />
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Home;
