import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    GroupRoomType,
    PrivateRoomType,
} from '../../types/models';
import PrivateChatListItem from './components/PrivateChatListItem';
import { MainStackNavigationProp } from '../../types/navigation';
import ProfilePicture from '../../components/ProfilePicture';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme as Theme } from '../../utils/theme';
import SearchBar from '../../components/SearchBar';
import { scale } from 'react-native-size-matters';
import useDebounce from '../../hooks/useDebounce';
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';

const Home = () => {
    const {
        theme: { theme },
        user: { user },
    } = useSelector((state: RootState) => state);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const navigation = useNavigation<MainStackNavigationProp>();
    const [rooms, setRooms] = useState<PrivateRoomType[] | GroupRoomType[]>([]);

    useEffect(() => {
        const unsub = firestore()
            .collection('rooms')
            .where('members', 'array-contains', user?.uid)
            .orderBy('lastMessage.timestamp', 'desc')
            .onSnapshot(snapshot => {
                if (snapshot) {
                    const docs = snapshot.docs.map(doc => doc.data());
                    setRooms(docs as PrivateRoomType[] | GroupRoomType[]);
                }
            });

        return () => unsub();
    }, []);

    const goToProfile = () => {
        navigation.navigate('Profile');
    };

    const goToSearch = () => {
        navigation.navigate('Search');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity activeOpacity={0.6} onPress={goToProfile}>
                    <ProfilePicture height={40} width={40} />
                </TouchableOpacity>
            ),
            headerTitle: 'Home',
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: '500',
                fontSize: scale(18),
                color: theme === 'light' ? Theme.light.text : Theme.dark.text,
            },
            headerRight: () => (
                <View style={styles.headerRight}>
                    <TouchableOpacity activeOpacity={0.6} onPress={goToSearch}>
                        <Ionicons
                            size={24}
                            name="person-add-outline"
                            color={
                                theme === 'light'
                                    ? Theme.common.secondaryBlack
                                    : Theme.common.secondaryWhite
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
                        <Feather
                            size={24}
                            name="edit"
                            color={
                                theme === 'light'
                                    ? Theme.common.secondaryBlack
                                    : Theme.common.secondaryWhite
                            }
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, theme]);

    return (
        <SafeAreaView
            style={[
                styles.root,
                theme === 'light'
                    ? { backgroundColor: Theme.light.background }
                    : { backgroundColor: Theme.dark.background },
            ]}>
            {/* search bar */}
            <SearchBar
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search for friends"
            />
            {/* status/stories section */}
            {/* // TODO status section */}
            {/* chat section */}
            <FlatList
                data={rooms}
                keyExtractor={(_, i) => i.toString()}
                ItemSeparatorComponent={() => (
                    <View style={{ marginVertical: 4 }} />
                )}
                renderItem={({
                    item,
                    index
                }: {
                    item: PrivateRoomType | GroupRoomType;
                    index: number;
                }) => {
                    if (item.type === 'PRIVATE') {
                        return <PrivateChatListItem key={index} data={item} />;
                    } else return null;
                }}
            />
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    headerRight: {
        width: scale(60),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
