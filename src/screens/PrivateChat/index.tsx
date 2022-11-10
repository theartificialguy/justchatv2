import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
    TextInput,
} from 'react-native';
import {
    MainStackNavigationProp,
    MainStackNavigatorType,
} from '../../types/navigation';
import {
    Ionicons,
    FontAwesome,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { createMessage, createPrivateRoom } from '../../utils/functions';
import firestore from '@react-native-firebase/firestore';
import { timeToDayConverter } from '../../utils/helpers';
import DaySeparator from './components/DaySeparator';
import MessageItem from './components/MessageItem';
import { theme as Theme } from '../../utils/theme';
import { scale } from 'react-native-size-matters';
import { MessageType } from '../../types/models';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './styles';

const PrivateChat = () => {
    const {
        params: { friendScreenData, homeScreenData, navigatedFrom },
    } = useRoute<RouteProp<MainStackNavigatorType, 'PrivateChat'>>();
    const firebaseUser = auth().currentUser;
    const theme = useSelector((state: RootState) => state.theme.theme);
    const navigation = useNavigation<MainStackNavigationProp>();
    const [message, setMessage] = useState('');
    const [froomId, setRoomId] = useState(''); // if navigated from friend screen
    const [fmembers, setMembers] = useState<string[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        // check if a room is already created, if yes, fetch chats, if not, create a new room
        const init = async () => {
            const userRef = firestore().collection('users');
            const res = await userRef
                .doc(firebaseUser?.uid)
                .collection('rooms')
                .get();
            if (res && !res.empty) {
                const rooms = res.docs.map(doc => doc.data());
                let flag = null;
                for (let i = 0; i < rooms.length; i++) {
                    const room = rooms[i];
                    if (
                        room.members.includes(firebaseUser?.uid) &&
                        room.members.includes(friendScreenData?.uid)
                    ) {
                        flag = true;
                        setMembers(room.members);
                        setRoomId(room.id);
                        return;
                    }
                }
                if (!flag) {
                    const _roomId = await createPrivateRoom({
                        type: 'PRIVATE',
                        lastMessage: {
                            text: '',
                            senderId: '',
                            timestamp: firestore.Timestamp.fromDate(new Date()),
                        },
                        members: [
                            firebaseUser?.uid ?? '',
                            // @ts-ignore
                            friendScreenData.uid,
                        ],
                        createdAt: firestore.FieldValue.serverTimestamp(),
                    });
                    setRoomId(_roomId ?? '');
                }
            } else {
                const _roomId = await createPrivateRoom({
                    type: 'PRIVATE',
                    lastMessage: {
                        text: '',
                        senderId: '',
                        timestamp: firestore.Timestamp.fromDate(new Date()),
                    },
                    // @ts-ignore
                    members: [firebaseUser?.uid, friendScreenData.uid],
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
                setRoomId(_roomId ?? '');
            }
        };
        if (navigatedFrom === 'FriendScreen') {
            init();
        }
    }, []);

    // set unread messages count to 0 when this chat opens
    useEffect(() => {
        const roomId = froomId ? froomId : homeScreenData?.id;
        if (!roomId) return;
        const setCount = async () => {
            await firestore()
                .collection('users')
                .doc(firebaseUser?.uid)
                .collection('rooms')
                .doc(roomId)
                .update({
                    unreadMessagesCount: 0,
                });
        };
        setCount();
        return () => {
            setCount();
        };
    }, [froomId]);

    useEffect(() => {
        let unsub: any;
        if (navigatedFrom === 'FriendScreen' && froomId) {
            unsub = firestore()
                .collection('rooms')
                .doc(froomId)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    if (snapshot) {
                        const docs = snapshot.docs.map(doc => doc.data());
                        setMessages(docs as MessageType[]);
                    }
                });
        } else {
            unsub = firestore()
                .collection('rooms')
                .doc(homeScreenData?.id)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    if (snapshot) {
                        const docs = snapshot.docs.map(doc => doc.data());
                        setMessages(docs as MessageType[]);
                    }
                });
        }

        return () => {
            if (froomId || homeScreenData?.id) {
                unsub();
            }
        };
    }, [froomId]);

    const onSendMessage = async () => {
        if (message === '') return;
        const messageData = {
            text: message.trim(),
            senderId: firebaseUser?.uid,
            timestamp: firestore.Timestamp.fromDate(new Date()),
        } as MessageType;
        const finalRoomId = froomId ? froomId : homeScreenData?.id;
        const finalMembers =
            fmembers.length > 0 ? fmembers : homeScreenData?.members;
        const filteredMembers =
            finalMembers?.filter(userId => userId !== firebaseUser?.uid) ?? [];
        await createMessage(finalRoomId ?? '', messageData, filteredMembers);
        setMessage('');
    };

    const renderItem = useCallback(
        ({ item, index }: { item: MessageType; index: number }) => {
            const currentMessage = messages[index];
            const previousMessage = messages[index + 1]; // +1 cuz we're in reverse order
            let Component: any | null;
            if (previousMessage) {
                const isSameDay =
                    currentMessage.timestamp.toDate().toDateString() ===
                    previousMessage.timestamp.toDate().toDateString();
                if (!isSameDay) {
                    Component = (
                        <DaySeparator
                            time={timeToDayConverter(
                                currentMessage.timestamp.toDate(),
                            )}
                        />
                    );
                }
            } else if (!previousMessage) {
                Component = (
                    <DaySeparator
                        time={timeToDayConverter(
                            currentMessage.timestamp.toDate(),
                        )}
                    />
                );
            }
            return (
                <>
                    <MessageItem item={item} />
                    {Component}
                </>
            );
        },
        [messages],
    );

    const goBackHandler = () => {
        navigation.goBack();
    };

    useLayoutEffect(() => {
        const headerTitle = () => {
            if (friendScreenData) {
                return friendScreenData.username;
            } else if (homeScreenData) {
                // @ts-ignore
                return homeScreenData.username;
            } else return 'Chat';
        };
        navigation.setOptions({
            headerTitle: headerTitle(),
            headerTitleAlign: 'left',
            headerTitleStyle: {
                fontWeight: '500',
                fontSize: scale(18),
                color: theme === 'light' ? Theme.light.text : Theme.dark.text,
            },
            headerLeft: () => (
                <TouchableOpacity activeOpacity={0.6} onPress={goBackHandler}>
                    <Ionicons
                        name="arrow-back"
                        size={26}
                        color={
                            theme === 'light'
                                ? Theme.light.text
                                : Theme.dark.text
                        }
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
                        <Ionicons
                            name="call"
                            size={24}
                            color={Theme.common.skyBlue}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
                        <FontAwesome
                            name="video-camera"
                            size={24}
                            color={Theme.common.skyBlue}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
                        <MaterialCommunityIcons
                            name="dots-vertical"
                            size={24}
                            color={Theme.common.skyBlue}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaView
            style={[
                styles.root,
                theme === 'light'
                    ? { backgroundColor: Theme.light.background }
                    : { backgroundColor: Theme.dark.background },
            ]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                keyboardVerticalOffset={100}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {/* messages body */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        inverted
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(_, i) => i.toString()}
                    />
                </View>

                {/* footer */}
                <View style={styles.footerContainer}>
                    <View
                        style={[
                            styles.inputContainer,
                            theme === 'light'
                                ? {
                                      backgroundColor: '#e2dede',
                                  }
                                : {
                                      backgroundColor:
                                          Theme.common.secondaryBlack,
                                  },
                        ]}>
                        <TouchableOpacity
                            style={styles.emojiContainer}
                            activeOpacity={0.6}>
                            <MaterialCommunityIcons
                                size={32}
                                name="emoticon-happy"
                                color={Theme.common.skyBlue}
                            />
                        </TouchableOpacity>

                        <TextInput
                            multiline
                            numberOfLines={5}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Message..."
                            style={[
                                styles.input,
                                theme === 'light'
                                    ? { color: Theme.light.text }
                                    : { color: Theme.dark.text },
                            ]}
                            placeholderTextColor={
                                theme === 'light'
                                    ? Theme.common.secondaryBlack
                                    : Theme.common.secondaryWhite
                            }
                        />

                        <TouchableOpacity
                            style={styles.attachButton}
                            onPress={() => {}}>
                            <Ionicons
                                size={32}
                                name="attach"
                                color={Theme.common.skyBlue}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={() => {}}>
                            <Ionicons
                                size={32}
                                name="camera"
                                color={Theme.common.skyBlue}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.sendContainer,
                            theme === 'light'
                                ? {
                                      backgroundColor: '#e2dede',
                                  }
                                : {
                                      backgroundColor:
                                          Theme.common.secondaryBlack,
                                  },
                        ]}
                        onPress={onSendMessage}>
                        <Ionicons
                            size={24}
                            name="md-send"
                            color={Theme.common.skyBlue}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View
                        style={[styles.modalBg, StyleSheet.absoluteFillObject]}
                    />
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PrivateChat;
