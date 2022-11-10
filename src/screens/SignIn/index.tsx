import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackNavigationProp } from '../../types/navigation';
import { signInWithEmailAndPassword } from '../../utils/firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SignInFormData } from '../../types/models';
import styles from './styles';

const SignIn = () => {
    const navigation = useNavigation<AuthStackNavigationProp>();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordSecureEntry, setIsPasswordSecureEntry] = useState(true);

    const toggleSecureEntry = useCallback(() => {
        setIsPasswordSecureEntry(!isPasswordSecureEntry);
    }, [isPasswordSecureEntry]);

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignInFormData) => {
        setIsLoading(true);
        await signInWithEmailAndPassword(data.email, data.password);
        setIsLoading(false);
        reset({ email: '', password: '' });
    };

    const goToSignUpScreen = () => {
      navigation.navigate('SignUp');
    };

    const goToForgotPasswordScreen = () => {
      navigation.navigate('ForgotPassword');
    }

    return (
        <SafeAreaView style={styles.root}>
            <Text style={styles.title}>Sign In</Text>

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

            {/* password textinput */}
            <Controller
                control={control}
                rules={{
                    required: {
                        value: true,
                        message: 'Password is required.',
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            onPress={toggleSecureEntry}
                            activeOpacity={0.6}>
                            {isPasswordSecureEntry ? (
                                <Ionicons
                                    name="eye-off"
                                    size={24}
                                    color="gray"
                                />
                            ) : (
                                <Ionicons name="eye" size={24} color="gray" />
                            )}
                        </TouchableOpacity>
                        <TextInput
                            value={value}
                            onBlur={onBlur}
                            style={styles.input}
                            placeholder="Password"
                            onChangeText={onChange}
                            placeholderTextColor="#757575"
                            secureTextEntry={isPasswordSecureEntry}
                        />
                    </View>
                )}
                name="password"
            />
            {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            {/* forgot password */}
            <TouchableOpacity
                onPress={goToForgotPasswordScreen}
                activeOpacity={0.6}
                style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* submit button */}
            <CustomButton
                text="Sign In"
                isLoading={isLoading}
                callback={handleSubmit(onSubmit)}
                containerStyle={{ alignSelf: 'center', marginVertical: 20 }}
            />

            {/* spacer */}
            <View style={{ flex: 1 }} />

            {/* create a new account */}
            <View style={styles.footer}>
                <Text style={styles.footer1}>Don't have an account? </Text>
                <TouchableOpacity activeOpacity={0.6} onPress={goToSignUpScreen}>
                    <Text style={styles.footer2}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SignIn;
