import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { MainStackNavigationProp } from '../../../types/navigation';
import firestore from '@react-native-firebase/firestore';
import { AddFriendListItemType } from '../../../types/models';
import { useNavigation } from '@react-navigation/native';
import { theme as Theme } from '../../../utils/theme';
import auth from '@react-native-firebase/auth';
import ListSeparator from './ListSeparator';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import ListItem from './ListItem';

const Friends = () => {
    const user = auth().currentUser;
    const theme = useSelector((state: RootState) => state.theme.theme);
    const navigation = useNavigation<MainStackNavigationProp>();

    const [friends, setFriends] = useState<AddFriendListItemType[]>([]);

    useEffect(() => {
        const path = `users/${user?.uid}/friends`;
        const unsub = firestore()
            .collection(path)
            .onSnapshot(snapshot => {
                if (snapshot) {
                    const docs = snapshot.docs.map(doc => doc.data());
                    setFriends(docs as AddFriendListItemType[]);
                }
            });

        return () => unsub();
    }, []);

    const goToChatScreen = (item: AddFriendListItemType) => {
        navigation.navigate('PrivateChat', {
            friendScreenData: item,
            homeScreenData: null,
            navigatedFrom: 'FriendScreen',
        });
    };

    const renderItem = useCallback(
        ({ item }: { item: AddFriendListItemType }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => goToChatScreen(item)}>
                <ListItem
                    title="Remove"
                    type="Friend"
                    theme={theme}
                    profileData={item}
                />
            </TouchableOpacity>
        ),
        [friends],
    );

    return (
        <SafeAreaView
            style={[
                styles.root,
                theme === 'light'
                    ? { backgroundColor: Theme.light.background }
                    : { backgroundColor: Theme.dark.background },
            ]}>
            <FlatList
                data={friends}
                renderItem={renderItem}
                keyExtractor={(_, i) => i.toString()}
                ItemSeparatorComponent={ListSeparator}
            />
        </SafeAreaView>
    );
};

export default Friends;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
