import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ForgotPasswordFormData } from '../../types/models';
import styles from './styles';
import { sendPasswordResetEmail } from '../../utils/firebase';

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        await sendPasswordResetEmail(data.email);
        reset({ email: '' });
        setIsLoading(false);
        navigation.goBack();
    };

    const goBackHandler = () => {
      navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.root}>
            {/* back button */}
            <TouchableOpacity onPress={goBackHandler} activeOpacity={0.6}>
                <Ionicons name='arrow-back' size={26} color='black' />
            </TouchableOpacity>

            <Text style={styles.title}>Reset Password</Text>

            {/* email textinput */}
            <Controller
                control={control}
                rules={{
                    required: {
                        value: true,
                        message: 'E-mail is required.',
                    },
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address',
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail" size={24} color="gray" />
                        <TextInput
                            value={value}
                            onBlur={onBlur}
                            style={styles.input}
                            placeholder="E-mail"
                            onChangeText={onChange}
                            placeholderTextColor="#757575"
                        />
                    </View>
                )}
                name="email"
            />
            {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            {/* submit button */}
            <CustomButton
                text="Send Code"
                isLoading={isLoading}
                callback={handleSubmit(onSubmit)}
                containerStyle={{ alignSelf: 'center', marginVertical: 20 }}
            />
        </SafeAreaView>
    );
};

export default ForgotPassword;
