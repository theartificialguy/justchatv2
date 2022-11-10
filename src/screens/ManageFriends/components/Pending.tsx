import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { AddFriendListItemType } from '../../../types/models';
import firestore from '@react-native-firebase/firestore';
import { theme as Theme } from '../../../utils/theme';
import auth from '@react-native-firebase/auth';
import ListSeparator from './ListSeparator';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import ListItem from './ListItem';

const Pending = () => {
    const user = auth().currentUser;
    const theme = useSelector((state: RootState) => state.theme.theme);

    const [friendRequests, setFriendRequests] = useState<AddFriendListItemType[]>(
        [],
    );

    useEffect(() => {
        const path = `users/${user?.uid}/friendRequests`;
        const unsub = firestore()
            .collection(path)
            .onSnapshot(snapshot => {
                if (snapshot) {
                    const docs = snapshot.docs.map(doc => doc.data());
                    setFriendRequests(docs as AddFriendListItemType[]);
                }
            });

        return () => unsub();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: AddFriendListItemType }) => (
            <ListItem title='Pending' type='Pending' theme={theme} profileData={item} />
        ),
        [friendRequests],
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
                data={friendRequests}
                renderItem={renderItem}
                keyExtractor={(_, i) => i.toString()}
                ItemSeparatorComponent={ListSeparator}
            />
        </SafeAreaView>
    );
};

export default Pending;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
