import React from 'react'
import MainNavigator from './navigation/MainNavigator'
import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


Parse.setAsyncStorage(AsyncStorage);
Parse.serverURL = 'https://parseapi.back4app.com'; 
Parse.initialize(
  'GHY0jz9HveFJ4pnmvweDDjgISxo6TTyYc0PTPnYF', 
  'D5EbB1G893nvxPDPzz6Snug0MTH98k5rcEFZuH0U' 
);

export default function App() {
  return (
      <MainNavigator/>
  );
}
