import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { theme as Theme } from '../../../utils/theme';
import { MessageType } from '../../../types/models';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const MessageItem = ({ item }: { item: MessageType }) => {
    const {
        user: { user },
        theme: { theme },
    } = useSelector((state: RootState) => state);
    const isMe = user?.uid === item.senderId;
    return (
        <View
            style={[
                styles.container,
                isMe
                    ? {
                          backgroundColor: Theme.common.skyBlue,
                          marginLeft: 'auto',
                          marginRight: scale(4),
                          borderTopRightRadius: 0,
                      }
                    : {
                          backgroundColor:
                              theme === 'light'
                                  ? 'lightgray'
                                  : Theme.dark.offBlack,
                          marginRight: 'auto',
                          marginLeft: scale(4),
                          borderTopLeftRadius: 0,
                      },
            ]}>
            <Text
                style={[
                    styles.text,
                    isMe
                        ? { color: Theme.common.primaryWhite }
                        : theme === 'light'
                        ? { color: Theme.light.text }
                        : { color: Theme.dark.text },
                ]}>
                {item.text}
            </Text>

            <View style={styles.timeStatusContainer}>
                <Text
                    style={[
                        styles.time,
                        isMe
                            ? { color: Theme.common.primaryWhite }
                            : theme === 'light'
                            ? { color: Theme.light.text }
                            : { color: Theme.dark.text },
                    ]}>
                    {item.timestamp.toDate().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>
        </View>
    );
};

export default MessageItem;

const styles = StyleSheet.create({
    container: {
        maxWidth: '75%',
        marginVertical: verticalScale(3),
        borderRadius: 14,
        padding: scale(10),
    },
    text: {
        fontWeight: '500',
        fontSize: scale(14),
    },
    timeStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: verticalScale(4),
    },
    time: {
        fontWeight: '500',
        color: 'lightgray',
        fontSize: scale(10),
        marginRight: scale(4),
    },
});
