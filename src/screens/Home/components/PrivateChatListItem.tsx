import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { PrivateRoomType, AddFriendListItemType } from '../../../types/models';
import { MainStackNavigationProp } from '../../../types/navigation';
import ProfilePicture from '../../../components/ProfilePicture';
import { timeToDayConverter } from '../../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { theme as Theme } from '../../../utils/theme';
import { scale } from 'react-native-size-matters';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';

const PrivateChatListItem = ({ data }: { data: PrivateRoomType }) => {
    const {
        user: { user },
        theme: { theme },
    } = useSelector((state: RootState) => state);
    const friendId = data.members.find(memberId => memberId !== user?.uid);
    const [friendData, setFriendData] = useState<AddFriendListItemType>();
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
    const time =
        timeToDayConverter(data.lastMessage.timestamp.toDate()) === 'Today'
            ? data.lastMessage.timestamp.toDate().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
              })
            : timeToDayConverter(data.lastMessage.timestamp.toDate());

    const navigation = useNavigation<MainStackNavigationProp>();

    const fetchData = useCallback(async () => {
        const doc = await firestore().collection('users').doc(friendId).get();
        if (doc.exists) {
            const docData = doc.data() as any;
            setFriendData({
                uid: docData['uid'],
                email: docData['email'],
                photoURL: docData['photoURL'],
                username: docData['username'],
            } as AddFriendListItemType);
        }
    }, [data]);

    // extract friend data
    useEffect(() => {
        fetchData();
    }, []);

    // realtime unread message count
    useEffect(() => {
        const unsub = firestore()
            .collection('users')
            .doc(user?.uid)
            .collection('rooms')
            .doc(data.id)
            .onSnapshot(snapshot => {
                if (snapshot) {
                    const docData = snapshot.data()?.['unreadMessagesCount'];
                    setUnreadMessagesCount(docData);
                }
            });
        return () => unsub();
    }, []);

    const goToChat = () => {
        navigation.navigate('PrivateChat', {
            navigatedFrom: 'HomeScreen',
            // @ts-ignore
            homeScreenData: { username: friendData?.username, ...data },
            friendScreenData: null,
        });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.6}
            onPress={goToChat}>
            <ProfilePicture uri={friendData?.photoURL} height={60} width={60} />
            <View style={styles.midContainer}>
                <Text
                    numberOfLines={1}
                    style={[
                        styles.username,
                        theme === 'light'
                            ? { color: Theme.light.text }
                            : { color: Theme.dark.text },
                    ]}>
                    {friendData?.username}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[
                        styles.message,
                        theme === 'light'
                            ? { color: Theme.light.text }
                            : { color: Theme.dark.text },
                        unreadMessagesCount > 0 && { fontWeight: 'bold' },
                    ]}>
                    {data.lastMessage.senderId === user?.uid
                        ? `You: ${data.lastMessage.text}`
                        : data.lastMessage.text}
                </Text>
            </View>
            <View style={styles.rightContainer}>
                <Text
                    style={[
                        styles.message,
                        { fontSize: scale(12) },
                        theme === 'light'
                            ? { color: Theme.dark.offBlack }
                            : { color: Theme.light.offWhite },
                    ]}>
                    {time}
                </Text>
                {unreadMessagesCount && unreadMessagesCount > 0 ? (
                    <View style={styles.unreadMessageContainer}>
                        <Text style={styles.unreadMessageText}>
                            {unreadMessagesCount}
                        </Text>
                    </View>
                ) : (
                    <Text />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default PrivateChatListItem;

const styles = StyleSheet.create({
    container: {
        padding: 4,
        flexDirection: 'row',
        marginHorizontal: 4,
    },
    midContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-evenly',
    },
    username: {
        fontSize: scale(16),
        fontWeight: '500',
    },
    message: {
        fontSize: scale(14),
        fontWeight: '400',
    },
    rightContainer: {
        marginLeft: 5,
        justifyContent: 'space-evenly',
    },
    unreadMessageContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        backgroundColor: Theme.common.skyBlue,
    },
    unreadMessageText: {
        fontWeight: '500',
        fontSize: scale(12),
        color: Theme.common.primaryWhite,
    },
});
