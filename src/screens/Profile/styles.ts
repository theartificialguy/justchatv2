import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
    },
    headerRight: {
        width: scale(60),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profilePicContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: verticalScale(10),
    },
    usernameEmailContainer: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: verticalScale(10),
    },
    username: {
        fontSize: scale(20),
        fontWeight: '600',
        marginBottom: 6,
    },
    email: {
        fontSize: scale(16),
        fontWeight: '500',
    },
    optionsContainer: {
        width: '100%',
        paddingHorizontal: 10,
        marginVertical: verticalScale(10),
    },
    optionSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(7),
    },
    sectionText: {
        fontSize: scale(16),
        fontWeight: '400',
    },
});

export default styles;
