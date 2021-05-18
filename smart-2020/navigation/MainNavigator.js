import * as React from 'react'
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


import Login from '../screens/Login'
import Register from '../screens/Register'
import RegisterInput from '../screens/RegisterInput'
import DrawerNavigator from './DrawerNavigator'


const Stack = createStackNavigator()

function MainNavigator() {
  LogBox.ignoreAllLogs()
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
        <Stack.Screen name='Register' component={Register} options={{headerShown:false}}/>
        <Stack.Screen name='RegisterInput' component={RegisterInput} options={{headerShown:false}} initialParams={{ user: null, username: "" }}/>
        <Stack.Screen name='DrawerNavigator' component={DrawerNavigator} options={{headerShown:false}} initialParams={{ user: null }}/>
      </Stack.Navigator>

    </NavigationContainer>
  )
}

export default MainNavigator
