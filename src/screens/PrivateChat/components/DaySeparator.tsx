import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme as Theme } from '../../../utils/theme';
import { scale, verticalScale } from 'react-native-size-matters';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';

const DaySeparator = ({ time }: { time: string }) => {
    const theme = useSelector((state: RootState) => state.theme.theme);

    return (
        <View
            style={[
                styles.container,
                theme === 'light'
                    ? { backgroundColor: Theme.light.offWhite }
                    : { backgroundColor: Theme.common.secondaryBlack },
            ]}>
            <Text
                style={[
                    styles.text,
                    theme === 'light'
                        ? { color: Theme.common.secondaryBlack }
                        : { color: Theme.dark.text },
                ]}>
                {time}
            </Text>
        </View>
    );
};

export default DaySeparator;

const styles = StyleSheet.create({
    container: {
        padding: 6,
        width: '25%',
        borderRadius: 8,
        marginVertical: verticalScale(12),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '500',
        fontSize: scale(12),
        textAlign: 'center',
    },
});
