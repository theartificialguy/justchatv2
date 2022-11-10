import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AccountCreationData } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { Alert } from 'react-native';

export const signInWithEmailAndPassword = async (
    email: string,
    password: string,
) => {
    try {
        await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.log('SIGNIN ERROR: ', error);
        Alert.alert('Something went wrong while trying to sign-in');
    }
};

export const sendPasswordResetEmail = async (email: string) => {
    try {
        await auth().sendPasswordResetEmail(email);
        Alert.prompt('Sent', 'Please check your mail for reset password');
    } catch (error) {
        console.log('PASSWORD RESET ERROR: ', error);
        Alert.alert('Something went wrong while trying to send reset email');
    }
};

export const signOut = async () => {
    try {
        await auth().signOut();
    } catch (error) {
        console.log('SIGNOUT ERROR: ', error);
        Alert.alert('Something went wrong while trying to sign out');
    }
};

export const createAccountWithEmailAndPassword = async ({
    email,
    imageURL,
    password,
    username,
}: AccountCreationData) => {
    try {
        // upload image
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', imageURL, true);
            xhr.send(null);
        });

        const filename = uuidv4();
        const storageRef = storage().ref('profile_pictures');
        const imageRef = storageRef.child(`${filename}.png`);
        imageRef
            .put(blob)
            .then(() => imageRef.getDownloadURL())
            .then(async downloadUrl => {
                // create account
                if (downloadUrl) {
                    const response =
                        await auth().createUserWithEmailAndPassword(
                            email,
                            password,
                        );

                    if (response.user) {
                        const { user } = response;
                        const ref = firestore().doc(`users/${user.uid}`);
                        // update user metadata
                        await ref.set({
                            email,
                            username,
                            friends: [],
                            roomIds: [],
                            uid: user.uid,
                            friendRequests: [],
                            photoURL: downloadUrl,
                        });
                    }
                }
            })
            .catch(err =>
                console.log(
                    'ERROR while trying to upload image to storage and creating account: ',
                    err,
                ),
            );
    } catch (error) {
        console.log('SIGNUP ERROR: ', error);
        Alert.alert('Something went wrong while trying to creating account');
    }
};
