import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type ForgotPasswordFormData = {
    email: string;
};

export type SignInFormData = {
    email: string;
    password: string;
};

export type SignUpFormData = {
    email: string;
    password: string;
    username: string;
};

export interface CustomButtonProps {
    text: string;
    iconName?: any;
    iconSize?: number;
    iconColor?: string;
    callback: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    buttonTextStyle?: StyleProp<TextStyle>;
}

export interface AccountCreationData {
    email: string;
    imageURL: string;
    password: string;
    username: string;
}

export interface ProfilePictureProp {
    uri?: string;
    height?: number;
    width?: number;
}

export interface SearchBarProps {
    onChangeText: (text: string) => void;
    value: string;
    placeholder: string;
}

export type AddFriendListItemType = {
    uid: string;
    email: string;
    username: string;
    photoURL: string;
};

export interface AddFriendListItemProps {
    theme: 'light' | 'dark';
    profileData: AddFriendListItemType;
}

export interface FriendListItemProps extends AddFriendListItemProps {
    title: string;
    type: 'Friend' | 'Pending';
}

export type MessageType = {
    text: string;
    senderId: string;
    timestamp: FirebaseFirestoreTypes.Timestamp;
};

export type PrivateRoomType = {
    id?: string;
    members: string[];
    lastMessage: MessageType;
    type: 'PRIVATE' | 'GROUP';
    createdAt: FirebaseFirestoreTypes.FieldValue;
};

export type GroupRoomType = {
    id?: string;
    owner: string;
    admins: string[];
    members: string[];
    groupPhotoURL: string;
    lastMessage: MessageType;
    groupDescription: string;
    type: 'PRIVATE' | 'GROUP';
    createdAt: FirebaseFirestoreTypes.FieldValue;
};
