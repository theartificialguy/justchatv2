import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackNavigatorType } from '../types/navigation';
import { ForgotPassword, SignIn, SignUp } from '../screens';
import { theme } from '../utils/theme';

const Stack = createNativeStackNavigator<AuthStackNavigatorType>();

const AuthStack = () => {
    return (
        <>
            <StatusBar
                backgroundColor={theme.light.background}
                barStyle="dark-content"
            />
            <Stack.Navigator
                initialRouteName="SignIn"
                screenOptions={{ header: () => null }}>
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name='ForgotPassword' component={ForgotPassword}  />
            </Stack.Navigator>
        </>
    );
};

export default AuthStack;
