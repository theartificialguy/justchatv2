import React from 'react';
import { StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme as Theme } from '../../utils/theme';

const Loader = () => {
    return (
        <SafeAreaView style={styles.root}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Theme.light.background}
            />
            <ActivityIndicator size={'small'} color={Theme.common.skyBlue} />
        </SafeAreaView>
    );
};

export default Loader;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.light.background,
    },
});
