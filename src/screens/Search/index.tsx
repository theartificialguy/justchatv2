import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { theme as Theme } from '../../utils/theme';
import SearchBar from '../../components/SearchBar';
import { scale } from 'react-native-size-matters';
import useDebounce from '../../hooks/useDebounce';
import auth from '@react-native-firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FlatList } from 'react-native-gesture-handler';
import { AddFriendListItemType } from '../../types/models';
import AddFriendListItem from './components/AddFriendListitem';
import ListSeparator from './components/ListSeparator';

const Search = () => {
    const user = auth().currentUser;
    const theme = useSelector((state: RootState) => state.theme.theme);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [results, setResults] = useState<null | AddFriendListItemType[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (debouncedSearchTerm) {
            const fetchUsers = async () => {
                setIsLoading(true);
                const users = firestore()
                    .collection('users')
                    .orderBy('username')
                    .startAt(debouncedSearchTerm)
                    .endAt(debouncedSearchTerm + '\uf8ff')
                    .get();
                try {
                    const result = await users;
                    if (result && !result.empty) {
                        const searchResults = result.docs
                            .map(doc => doc.data())
                            .filter(doc => doc.uid !== user?.uid)
                            .map(data => ({
                                uid: data.uid,
                                email: data.email,
                                username: data.username,
                                photoURL: data.photoURL,
                            }));
                        setResults(searchResults as AddFriendListItemType[]);
                    } else {
                        setResults([]);
                    }
                } catch (error) {
                    console.log('Error while trying to fetch users: ', error);
                }
                setIsLoading(false);
            };
            fetchUsers();
        } else {
            setResults([]);
        }
    }, [debouncedSearchTerm]);

    const goBackHandler = () => {
        navigation.goBack();
    };

    const renderItem = useCallback(
        ({ item }: { item: AddFriendListItemType }) => (
            <AddFriendListItem theme={theme} profileData={item} />
        ),
        [debouncedSearchTerm],
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Find new friends',
            headerTitleAlign: 'center',
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
            {/* search bar */}
            <SearchBar
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search for friends"
            />
            {/* searched users list */}
            {isLoading && (
                <ActivityIndicator
                    size={'small'}
                    color={Theme.common.skyBlue}
                />
            )}

            {debouncedSearchTerm &&
            debouncedSearchTerm.length > 0 &&
            results?.length === 0 ? (
                <Text
                    style={[
                        styles.btnText,
                        theme === 'light'
                            ? { color: Theme.light.text }
                            : { color: Theme.dark.text },
                        { textAlign: 'center', marginTop: 5 },
                    ]}>
                    No users found matching "{debouncedSearchTerm}"
                </Text>
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(_, i) => i.toString()}
                    ItemSeparatorComponent={ListSeparator}
                />
            )}
        </SafeAreaView>
    );
};

export default Search;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    btnText: {
        fontSize: scale(16),
        fontWeight: '400',
    },
});
