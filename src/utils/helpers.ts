import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const pickImageFromGallery = async () => {
    try {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === ImagePicker.PermissionStatus.GRANTED) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                return result.uri;
            }
        } else if (status === ImagePicker.PermissionStatus.DENIED) {
            Alert.alert(
                'Sorry',
                'You need to grant Gallery permission to use this app',
            );
        }
        return null;
    } catch (error) {
        console.log('Error while trying to pick image: ', error);
        return null;
    }
};

export const pickImageFromCamera = async () => {
    try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === ImagePicker.PermissionStatus.GRANTED) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                return result.uri;
            }
        } else if (status === ImagePicker.PermissionStatus.DENIED) {
            Alert.alert(
                'Sorry',
                'You need to grant Camera permission to use this app',
            );
        }
        return null;
    } catch (error) {
        console.log('Error while trying to pick image: ', error);
        return null;
    }
};

export const storeDataInAsyncStorage = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log('ERROR while storing in async storage', error);
        Alert.alert(
            'Something went wrong while trying to save to async storage',
        );
    }
};

export const getDataFromAsyncStorage = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
        return null;
    } catch (error) {
        console.log('ERROR while retrieving from async storage', error);
        Alert.alert(
            'Something went wrong while trying to retrieve data from async storage',
        );
    }
};

export const timeToDayConverter = (time: Date) => {
    const today = new Date();
    const isSameDay = today.toDateString() === time.toDateString();
    if (isSameDay) return 'Today';
    const diff_days = new Date().getDate() - time.getDate();
    const diff_months = new Date().getMonth() - time.getMonth();
    const diff_years = new Date().getFullYear() - time.getFullYear();
    const isYesterday =
        diff_years === 0 && diff_months === 0 && diff_days === 1;
    if (isYesterday) return 'Yesterday';
    else return time.toLocaleDateString();
};
