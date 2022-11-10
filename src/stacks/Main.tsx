import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateChat, Home, ManageFriends, Profile, Search } from '../screens';
import { MainStackNavigatorType } from '../types/navigation';
import { theme as Theme } from '../utils/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Stack = createNativeStackNavigator<MainStackNavigatorType>();

const MainStack = () => {
    const theme = useSelector((state: RootState) => state.theme.theme);

    return (
        <>
            <StatusBar
                backgroundColor={
                    theme === 'light'
                        ? Theme.light.background
                        : Theme.dark.background
                }
                barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
            />
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor:
                            theme === 'light'
                                ? Theme.light.background
                                : Theme.dark.background,
                    },
                }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="PrivateChat" component={PrivateChat} />
                <Stack.Screen name="ManageFriends" component={ManageFriends} />
            </Stack.Navigator>
        </>
    );
};

export default MainStack;
