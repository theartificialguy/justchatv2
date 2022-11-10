import React, { useLayoutEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { useNavigation } from '@react-navigation/native';
import { Friends, Pending } from './components';
import { theme as Theme } from '../../utils/theme';
import { scale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ManageFriends = () => {
    const navigation = useNavigation();
    const theme = useSelector((state: RootState) => state.theme.theme);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const goBackHandler = () => {
        navigation.goBack();
    };

    const handleCustomIndexSelect = (index: number) => {
        setSelectedIndex(index);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Manage friends',
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
            <SegmentedControlTab
                values={['Friends', 'Pending']}
                selectedIndex={selectedIndex}
                onTabPress={handleCustomIndexSelect}
                borderRadius={20}
                tabsContainerStyle={{
                    height: 40,
                    marginHorizontal: 5,
                    marginVertical: 10,
                }}
                tabStyle={{
                    backgroundColor: theme === 'light' ? 'lightgray' : 'gray',
                    borderWidth: 0,
                    borderColor: 'transparent',
                }}
                activeTabStyle={{
                    backgroundColor:
                        theme === 'light'
                            ? Theme.light.offWhite
                            : Theme.dark.offBlack,
                }}
                tabTextStyle={{ color: '#444444', fontWeight: 'bold' }}
                activeTabTextStyle={{
                    fontSize: scale(14),
                    fontWeight: '500',
                    color:
                        theme === 'light' ? Theme.light.text : Theme.dark.text,
                }}
            />
            {selectedIndex === 0 && <Friends />}
            {selectedIndex === 1 && <Pending />}
        </SafeAreaView>
    );
};

export default ManageFriends;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
