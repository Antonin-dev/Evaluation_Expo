import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import MyCamera from './components/MyCamera';
import MyGallery from './components/MyGallery';
import { Provider } from 'react-redux';
import { store } from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <MyCamera />
        <View style={styles.gallery}>
          <MyGallery />
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gallery: {
    flex: 0.3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  images: {
    width: '30%',
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
});
