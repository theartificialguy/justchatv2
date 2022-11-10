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
});

export default styles;
