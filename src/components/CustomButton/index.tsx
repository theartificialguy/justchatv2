import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButtonProps } from '../../types/models';
import styles from './styles';

const CustomButton = ({
    text,
    iconName,
    iconSize,
    iconColor,
    callback,
    disabled,
    isLoading,
    containerStyle,
    buttonTextStyle,
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[styles.container, containerStyle]}
            activeOpacity={0.6}
            onPress={callback}>
            {isLoading ? (
                <ActivityIndicator size={'small'} color="lightgray" />
            ) : (
                <>
                    {iconName && (
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={iconName}
                                size={iconSize}
                                color={iconColor}
                            />
                        </View>
                    )}
                    <Text style={[styles.buttonText, buttonTextStyle]}>
                        {text}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default CustomButton;
