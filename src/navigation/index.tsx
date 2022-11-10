import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import {
    getDataFromAsyncStorage,
    storeDataInAsyncStorage,
} from '../utils/helpers';
import firestore from '@react-native-firebase/firestore';
import { AuthStack, MainStack } from '../stacks';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/features/userSlice';
import { setTheme } from '../store/features/themeSlice';
import Loader from '../components/Loader';
import type { RootState } from '../store';

const Navigation = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsub = auth().onAuthStateChanged(async result => {
            if (result) {
                const ref = firestore().doc(`users/${result.uid}`);
                const userData = await ref.get();
                if (userData.exists) {
                    const data = userData.data() as any;
                    dispatch(
                        setUser({
                            uid: data['uid'],
                            email: data['email'],
                            photoURL: data['photoURL'],
                            username: data['username'],
                        }),
                    );
                }
            }
            const themeState = await getDataFromAsyncStorage('theme');
            if (themeState) {
                dispatch(setTheme(themeState as 'light' | 'dark'));
            } else {
                await storeDataInAsyncStorage('theme', 'light');
            }
            if (!result) {
                dispatch(setUser(null));
            }
            if (initializing) {
                setInitializing(false);
            }
        });
        return () => unsub();
    }, []);

    if (initializing) {
        return <Loader />
    }

    return (
        <NavigationContainer>
            {user === null ? <AuthStack /> : <MainStack />}
        </NavigationContainer>
    );
};

export default Navigation;
