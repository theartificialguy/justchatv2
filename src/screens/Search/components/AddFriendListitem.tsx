import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { scale } from 'react-native-size-matters';
import { theme as Theme } from '../../../utils/theme';
import ProfilePicture from '../../../components/ProfilePicture';
import {
    AddFriendListItemProps,
    AddFriendListItemType,
} from '../../../types/models';
import {
    acceptFriendRequest,
    cancelSentFriendRequest,
    checkFriendStatus,
    FriendStatus,
    rejectFriendRequest,
    removeFriend,
    sendFriendRequest,
} from '../../../utils/functions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const AddFriendListItem = ({ theme, profileData }: AddFriendListItemProps) => {
    const firebaseUser = auth().currentUser;
    const user = useSelector((state: RootState) => state.user.user);
    const isMounted = useRef(true);
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<null | FriendStatus>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            const result = await checkFriendStatus(
                firebaseUser?.uid ?? '',
                profileData.uid,
            );
            setStatus(result);
        };
        fetchStatus();

        return () => {
            isMounted.current = false;
        };
    }, [isSending]);

    const handleAction = async () => {
        if (isSending) {
            return;
        }

        setIsSending(true);

        const myProfileData = {
            uid: firebaseUser?.uid,
            email: firebaseUser?.email,
            username: user?.username,
            photoURL: user?.photoURL,
        } as AddFriendListItemType;

        if (status === FriendStatus.ADD) {
            // both are not friends yet
            await sendFriendRequest(myProfileData, profileData);
        } else if (status === FriendStatus.PENDING) {
            // an option to cancel request
            await cancelSentFriendRequest(myProfileData, profileData);
        } else if (status === FriendStatus.REQUEST) {
            // option to accept or reject
        } else if (status === FriendStatus.FRIEND) {
            // an option to remove friend
            await removeFriend(myProfileData, profileData);
        }

        setIsSending(false);

        return;
    };

    const handleAccept = async () => {
        if (isSending) {
            return;
        }

        setIsSending(true);

        const myProfileData = {
            uid: firebaseUser?.uid,
            email: firebaseUser?.email,
            username: user?.username,
            photoURL: user?.photoURL,
        } as AddFriendListItemType;
        
        await acceptFriendRequest(myProfileData, profileData);
        setIsSending(false);
        return;
    };

    const handleReject = async () => {
        if (isSending) {
            return;
        }

        setIsSending(true);

        const myProfileData = {
            uid: firebaseUser?.uid,
            email: firebaseUser?.email,
            username: user?.username,
            photoURL: user?.photoURL,
        } as AddFriendListItemType;
        
        await rejectFriendRequest(myProfileData, profileData);
        setIsSending(false);
        return;
    };

    return (
        <View style={[styles.container, { padding: 4, marginHorizontal: 4 }]}>
            <View style={styles.container}>
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
            {status === FriendStatus.REQUEST ? (
                <View style={styles.container}>
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
                    onPress={handleAction}
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
                        {status}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default AddFriendListItem;

const styles = StyleSheet.create({
    container: {
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
