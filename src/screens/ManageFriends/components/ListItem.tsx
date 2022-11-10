import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfilePicture from '../../../components/ProfilePicture';
import {
    FriendListItemProps,
    AddFriendListItemType,
} from '../../../types/models';
import {
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
} from '../../../utils/functions';
import { theme as Theme } from '../../../utils/theme';
import { scale } from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const ListItem = ({ theme, profileData, title, type }: FriendListItemProps) => {
    const firebaseUser = auth().currentUser;
    const user = useSelector((state: RootState) => state.user.user);

    const handleRemoveFriend = async () => {
        const myProfileData = {
            uid: firebaseUser?.uid,
            email: firebaseUser?.email,
            username: user?.username,
            photoURL: user?.photoURL,
        } as AddFriendListItemType;
        await removeFriend(myProfileData, profileData);
        return;
    };

    const handleAccept = async () => {
        const myProfileData = {
            uid: firebaseUser?.uid,
            email: firebaseUser?.email,
            username: user?.username,
            photoURL: user?.photoURL,
        } as AddFriendListItemType;
        await acceptFriendRequest(myProfileData, profileData);
        return;
    };

    const handleReject = async () => {
        const myProfileData = {
            uid: firebaseUser?.uid,
            email: firebaseUser?.email,
            username: user?.username,
            photoURL: user?.photoURL,
        } as AddFriendListItemType;
        await rejectFriendRequest(myProfileData, profileData);
        return;
    };

    return (
        <View style={[styles.root, { padding: 4, marginHorizontal: 4 }]}>
            <View style={styles.root}>
                <ProfilePicture
                    uri={profileData.photoURL}
                    height={54}
                    width={54}
                />
                <Text
                    style={[
                        styles.username,
                        theme === 'light'
                            ? { color: Theme.light.text }
                            : { color: Theme.dark.text },
                        { marginLeft: 10 },
                    ]}>
                    {profileData.username}
                </Text>
            </View>
            {title === 'Pending' ? (
                <View style={styles.root}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={handleAccept}
                        style={[
                            styles.btnContainer,
                            { paddingHorizontal: 12, marginRight: 6 },
                            theme === 'light'
                                ? { backgroundColor: Theme.light.offWhite }
                                : { backgroundColor: Theme.dark.offBlack },
                        ]}>
                        <Text
                            style={[
                                styles.btnText,
                                theme === 'light'
                                    ? { color: Theme.light.text }
                                    : { color: Theme.dark.text },
                            ]}>
                            Accept
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={handleReject}
                        style={[
                            styles.btnContainer,
                            { paddingHorizontal: 12 },
                            theme === 'light'
                                ? { backgroundColor: Theme.light.offWhite }
                                : { backgroundColor: Theme.dark.offBlack },
                        ]}>
                        <Text
                            style={[
                                styles.btnText,
                                theme === 'light'
                                    ? { color: Theme.light.text }
                                    : { color: Theme.dark.text },
                            ]}>
                            Reject
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={handleRemoveFriend}
                    style={[
                        styles.btnContainer,
                        theme === 'light'
                            ? { backgroundColor: Theme.light.offWhite }
                            : { backgroundColor: Theme.dark.offBlack },
                    ]}>
                    <Text
                        style={[
                            styles.btnText,
                            theme === 'light'
                                ? { color: Theme.light.text }
                                : { color: Theme.dark.text },
                        ]}>
                        {title}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ListItem;

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    username: {
        fontSize: scale(18),
        fontWeight: '400',
    },
    btnContainer: {
        padding: 6,
        paddingHorizontal: 30,
        borderRadius: 16,
    },
    btnText: {
        fontSize: scale(16),
        fontWeight: '400',
    },
});
