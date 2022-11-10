import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { SearchBarProps } from '../../types/models';
import { theme as Theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const SearchBar = ({ value, onChangeText, placeholder }: SearchBarProps) => {
    const theme = useSelector((state: RootState) => state.theme.theme);
    return (
        <View
            style={[
                styles.container,
                theme === 'light'
                    ? { backgroundColor: Theme.light.offWhite }
                    : { backgroundColor: Theme.dark.offBlack },
            ]}>
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={[
                    styles.textInput,
                    theme === 'light'
                        ? { color: Theme.light.text }
                        : { color: Theme.dark.text },
                ]}
                placeholder={placeholder}
                placeholderTextColor="gray"
                maxLength={20}
            />
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        marginVertical: verticalScale(10),
        marginHorizontal: scale(5),
        flexDirection: 'row',
        alignItems: 'center',
        maxHeight: verticalScale(40),
        paddingHorizontal: moderateScale(5),
        borderRadius: moderateScale(50),
    },
    textInput: {
        flex: 1,
        minHeight: verticalScale(35),
        fontSize: moderateScale(16),
        marginLeft: scale(6),
    },
});
