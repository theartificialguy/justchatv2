import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AddFriendListItemType, PrivateRoomType } from './models';

export type AuthStackNavigatorType = {
    Auth: undefined;
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
};

export type AuthStackNavigationProp =
    NativeStackNavigationProp<AuthStackNavigatorType>;

export type MainStackNavigatorType = {
    Home: undefined;
    Search: undefined;
    Profile: undefined;
    ManageFriends: undefined;
    PrivateChat: {
        navigatedFrom: string;
        friendScreenData: AddFriendListItemType | null;
        homeScreenData: PrivateRoomType | null;
    };
};

export type MainStackNavigationProp =
    NativeStackNavigationProp<MainStackNavigatorType>;
