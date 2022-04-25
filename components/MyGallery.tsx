import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Ionicons } from '@expo/vector-icons';
import { deletePictureStore } from './slice/ImagesSlice';

function MyGallery() {
  const dispatch = useDispatch();
  const { data: images } = useSelector((state: RootState) => state.images);

  const deletePicture = (id: string) => {
    dispatch(deletePictureStore(id));
  };
  const onShare = async (item: string) => {
    try {
      const result = await Share.share({
        url: item,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.container}>
      <Image
        style={styles.images}
        source={{ uri: item.uri }}
        key={`image ${item.id}`}
      />
      <View style={styles.containerButton}>
        <TouchableOpacity
          onPress={() => {
            onShare(item.uri);
          }}
          key={`send ${item.id}`}
        >
          <Ionicons
            name="send-outline"
            size={30}
            color="green"
            key={`icon ${item.id}`}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deletePicture(item.id)}
          key={`touchable ${item.id}`}
        >
          <Ionicons
            name="trash-outline"
            size={30}
            color="red"
            key={`icon ${item.id}`}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <FlatList
      data={images}
      // @ts-ignore
      renderItem={images && renderItem}
      horizontal={true}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  images: {
    width: 120,
    height: 120,
    margin: 5,
    borderRadius: 10,
  },
});
export default MyGallery;
