import { Dimensions, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.8;

const styles = StyleSheet.create({
    container: {
        height: verticalScale(40),
        width: BUTTON_WIDTH,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f7fec',
    },
    iconContainer: {
        position: 'absolute',
        left: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: scale(18),
        fontWeight: 'bold',
    },
});

export default styles;
