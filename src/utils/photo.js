import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

// the photo is saved as text in Firestore, where a document is limited to 1 MB
const MAX_LENGTH = 700000;

async function compress(uri, quality) {
  const image = await ImageManipulator.manipulate(uri).resize({ width: 600 }).renderAsync();
  const result = await image.saveAsync({
    compress: quality,
    format: SaveFormat.JPEG,
    base64: true,
  });
  return `data:image/jpeg;base64,${result.base64}`;
}

// returns the photo as a data uri, or null if it is still too big
async function preparePhoto(uri) {
  let photo = await compress(uri, 0.5);

  if (photo.length > MAX_LENGTH) {
    photo = await compress(uri, 0.2);
  }

  if (photo.length > MAX_LENGTH) {
    Alert.alert('Снимка', 'Снимката е твърде голяма. Избери друга.');
    return null;
  }

  return photo;
}

// both functions return a data uri or null when nothing was chosen

export async function takePhoto() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Разрешение', 'Нужно е разрешение за камерата, за да снимаш.');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
  if (result.canceled) {
    return null;
  }

  return preparePhoto(result.assets[0].uri);
}

export async function pickPhoto() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Разрешение', 'Нужно е разрешение за галерията, за да избереш снимка.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
  if (result.canceled) {
    return null;
  }

  return preparePhoto(result.assets[0].uri);
}
