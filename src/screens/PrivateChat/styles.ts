import { StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
import { theme as Theme } from '../../utils/theme';

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    modalBg: {
        flex: 1,
        zIndex: -1,
    },
    headerRight: {
        width: 120,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerContainer: {
        flex: 1,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: scale(6),
        maxHeight: verticalScale(44),
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        borderWidth: 0.1,
        borderRadius: scale(24),
        borderColor: '#969698',
        marginRight: scale(10),
    },
    sendContainer: {
        width: scale(40),
        height: scale(40),
        alignItems: 'center',
        borderRadius: scale(20),
        justifyContent: 'center',
        backgroundColor: Theme.common.secondaryWhite,
    },
    emojiContainer: {
        marginLeft: scale(4),
    },
    input: {
        flex: 1,
        fontSize: scale(16),
        marginHorizontal: scale(5),
    },
    attachButton: {
        marginHorizontal: scale(5),
    },
    cameraButton: {
        marginRight: scale(10),
    },
});

export default styles;
