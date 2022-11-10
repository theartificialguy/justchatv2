import React, { useLayoutEffect, useMemo } from 'react';
import {
    Text,
    SafeAreaView,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { theme as Theme } from '../../utils/theme';
import { Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { MainStackNavigationProp } from '../../types/navigation';
import { storeDataInAsyncStorage } from '../../utils/helpers';
import ProfilePicture from '../../components/ProfilePicture';
import { setTheme } from '../../store/features/themeSlice';
import { scale } from 'react-native-size-matters';
import { signOut } from '../../utils/firebase';
import type { RootState } from '../../store';
import styles from './styles';

export interface SectionProps {
    Theme: any;
    title: string;
    iconName: any;
    iconColor: string;
    onPress: () => void;
    theme: 'light' | 'dark';
}

const Section = ({
    title,
    theme,
    Theme,
    onPress,
    iconName,
    iconColor,
}: SectionProps) => {
    return (
        <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={styles.optionSection}>
            <View style={[styles.optionSection, { flex: 1 }]}>
                <Ionicons name={iconName} size={30} color={iconColor} />
                <Text
                    style={[
                        styles.sectionText,
                        { marginLeft: 7 },
                        theme === 'light'
                            ? { color: Theme.light.text }
                            : { color: Theme.dark.text },
                    ]}>
                    {title}
                </Text>
            </View>
            <Entypo
                name="chevron-thin-right"
                size={20}
                color={
                    theme === 'light'
                        ? Theme.common.secondaryBlack
                        : Theme.common.secondaryWhite
                }
            />
        </TouchableOpacity>
    );
};

const Profile = () => {
    const dispatch = useDispatch();
    const {
        theme: { theme },
        user: { user },
    } = useSelector((state: RootState) => state);

    const navigation = useNavigation<MainStackNavigationProp>();

    const goBackHandler = () => {
        navigation.goBack();
    };

    const onChangeTheme = async () => {
        if (theme === 'dark') {
            storeDataInAsyncStorage('theme', 'light').then(() =>
                dispatch(setTheme('light')),
            );
        } else {
            storeDataInAsyncStorage('theme', 'dark').then(() =>
                dispatch(setTheme('dark')),
            );
        }
    };

    const handleSignOut = () => {
        Alert.alert('Sign out', 'Are you sure?', [
            {
                text: 'Cancel',
                style: 'destructive',
            },
            {
                text: 'Confirm',
                onPress: async () => await signOut(),
            },
        ]);
    };

    const sections = useMemo(
        () => [
            {
                title: 'Account Details',
                iconName: 'person-circle-outline',
                iconColor: Theme.common.skyBlue,
                onPress: () => {},
            },
            {
                title: 'Manage friends',
                iconName: 'person-add-outline',
                iconColor: Theme.common.skyBlue,
                onPress: () => navigation.navigate('ManageFriends'),
            },
            {
                title: 'Settings',
                iconName: 'settings-outline',
                iconColor:
                    theme === 'light'
                        ? Theme.common.secondaryBlack
                        : Theme.common.secondaryWhite,
                        onPress: () => {},
            },
            {
                title: 'Contact Us',
                iconName: 'md-call-outline',
                iconColor: Theme.common.lightGreen,
                onPress: () => {},
            },
            {
                title: 'Sign out',
                iconName: 'power-outline',
                iconColor: Theme.common.red,
                onPress: () => handleSignOut(),
            },
        ],
        [theme],
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity activeOpacity={0.6} onPress={goBackHandler}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={
                            theme === 'light'
                                ? Theme.common.secondaryBlack
                                : Theme.common.secondaryWhite
                        }
                    />
                </TouchableOpacity>
            ),
            headerTitle: 'My Profile',
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: '500',
                fontSize: scale(18),
                color: theme === 'light' ? Theme.light.text : Theme.dark.text,
            },
            headerRight: () => (
                <TouchableOpacity activeOpacity={0.6} onPress={onChangeTheme}>
                    {theme === 'light' ? (
                        <MaterialCommunityIcons
                            name="weather-night"
                            size={24}
                            color={Theme.common.secondaryBlack}
                        />
                    ) : (
                        <Entypo
                            name="light-up"
                            size={24}
                            color={Theme.common.secondaryWhite}
                        />
                    )}
                </TouchableOpacity>
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
            {/* profile section */}
            <View style={styles.profilePicContainer}>
                <ProfilePicture height={170} width={170} />
            </View>
            {/* username & email section */}
            <View style={styles.usernameEmailContainer}>
                <Text
                    style={[
                        styles.username,
                        theme === 'light'
                            ? { color: Theme.light.text }
                            : { color: Theme.dark.text },
                    ]}>
                    {user?.username}
                </Text>
                <Text
                    style={[
                        styles.email,
                        theme === 'light'
                            ? { color: Theme.common.secondaryBlack }
                            : { color: Theme.common.secondaryWhite },
                    ]}>
                    {user?.email}
                </Text>
            </View>
            {/* options section */}
            <View style={styles.optionsContainer}>
                {sections.map((item, i) => (
                    <Section
                        key={i.toString()}
                        {...item}
                        theme={theme}
                        Theme={Theme}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

export default Profile;
