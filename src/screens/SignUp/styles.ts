import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { theme } from '../../utils/theme';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 10,
        backgroundColor: theme.light.background,
    },
    title: {
        color: '#1f7fec',
        fontWeight: 'bold',
        fontSize: scale(30),
        marginVertical: verticalScale(30),
    },
    textInput: {
        alignSelf: 'stretch',
        marginHorizontal: 12,
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'grey',
        color: 'white',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    inputContainer: {
        padding: scale(8),
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: 'black',
        fontSize: scale(18),
        fontWeight: '500',
        borderRadius: scale(8),
        paddingLeft: scale(10),
        borderColor: '#757575',
        height: verticalScale(40),
        borderBottomWidth: scale(0.3),
    },
    errorText: {
        color: 'red',
        fontSize: scale(14),
        fontWeight: '400',
        paddingLeft: scale(10),
    },
    footer: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer1: {
        color: 'gray',
        fontSize: scale(14),
    },
    footer2: {
        color: '#1f7fec',
        fontSize: scale(14),
    },
    modalBg: {
        flex: 1,
        zIndex: -1,
    },
    avatarContainer: {
        width: scale(140),
        height: scale(140),
        borderRadius: scale(70),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    avatar: {
        width: scale(140),
        height: scale(140),
        borderRadius: scale(70),
    },
    camera: {
        top: 3,
        right: 5,
        position: 'absolute',
    },
    bottomSheetOptionContainer: {
        alignItems: 'center',
    },
    bottomSheetOptionText: {
        marginTop: 5,
        color: 'black',
        fontSize: scale(14),
        fontWeight: '500',
    },
    bottomSheetIconContainer: {
        height: scale(60),
        width: scale(60),
        borderRadius: scale(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;
