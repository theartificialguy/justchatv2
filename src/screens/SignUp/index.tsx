import React, { useCallback, useState, useMemo, useRef } from 'react';
import {
    Text,
    View,
    Image,
    Keyboard,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomButton from '../../components/CustomButton';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackNavigationProp } from '../../types/navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { pickImageFromCamera, pickImageFromGallery } from '../../utils/helpers';
import { createAccountWithEmailAndPassword } from '../../utils/firebase';
import { SignUpFormData } from '../../types/models';
import styles from './styles';

const avatar_placeholder = require('../../../assets/images/avatar-placeholder.png');

// TODO -> keyboard/bottomsheet open-close edge cases

const SignUp = () => {
    const navigation = useNavigation<AuthStackNavigationProp>();
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordSecureEntry, setIsPasswordSecureEntry] = useState(true);

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['20%'], []);

    // const handleSheetChange = useCallback((index: number) => {
    //     console.log('handleSheetChange', index);
    // }, []);

    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);

    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const toggleSecureEntry = useCallback(() => {
        setIsPasswordSecureEntry(!isPasswordSecureEntry);
    }, [isPasswordSecureEntry]);

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        defaultValues: {
            email: '',
            password: '',
            username: '',
        },
    });

    const onSubmit = async (data: SignUpFormData) => {
        if (!image) {
            Alert.alert('Image cannot be empty');
            return;
        }
        const _data = {
          imageURL: image,
          email: data.email,
          password: data.password,
          username: data.username,
        }
        setIsLoading(true);
        await createAccountWithEmailAndPassword(_data);
        setIsLoading(false);
        setImage(null);
        reset({ username: '', email: '', password: '' });
    };

    const goToSignInScreen = () => {
        navigation.navigate('SignIn');
    };

    const selectFromGallery = async () => {
        const uri = await pickImageFromGallery();
        if (uri) {
            setImage(uri);
        }
        handleClosePress();
    };

    const selectFromCamera = async () => {
        const uri = await pickImageFromCamera();
        if (uri) {
            setImage(uri);
        }
        handleClosePress();
    };

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Create new account</Text>

                <View style={styles.avatarContainer}>
                    <Image
                        source={image ? { uri: image } : avatar_placeholder}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        onPress={() => handleSnapPress(0)}
                        activeOpacity={0.6}
                        style={styles.camera}>
                        <MaterialCommunityIcons
                            name="camera-plus"
                            size={30}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <Controller
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'Username is required.',
                        },
                        minLength: {
                            value: 4,
                            message: 'Username must be at least 4 characters',
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <Ionicons name="person" size={24} color="gray" />
                            <TextInput
                                value={value}
                                onBlur={onBlur}
                                style={styles.input}
                                placeholder="Username"
                                onChangeText={onChange}
                                placeholderTextColor="#757575"
                            />
                        </View>
                    )}
                    name="username"
                />
                {errors.username && (
                    <Text style={styles.errorText}>
                        {errors.username.message}
                    </Text>
                )}

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
                        minLength: {
                            value: 6,
                            message: 'Password should be at least 6 characters',
                        },
                        maxLength: {
                            value: 20,
                            message: 'Password should be at most 20 characters',
                        },
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
                                    <Ionicons
                                        name="eye"
                                        size={24}
                                        color="gray"
                                    />
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
                    <Text style={styles.errorText}>
                        {errors.password.message}
                    </Text>
                )}

                {/* submit button */}
                <CustomButton
                    text="Sign Up"
                    isLoading={isLoading}
                    callback={handleSubmit(onSubmit)}
                    containerStyle={{ alignSelf: 'center', marginVertical: 20 }}
                />

                {/* spacer */}
                <View style={{ flex: 1 }} />

                {/* create a new account */}
                <View style={styles.footer}>
                    <Text style={styles.footer1}>
                        Already have an account?{' '}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={goToSignInScreen}>
                        <Text style={styles.footer2}>Sign In</Text>
                    </TouchableOpacity>
                </View>

                <BottomSheet
                    index={-1}
                    ref={sheetRef}
                    enablePanDownToClose
                    snapPoints={snapPoints}
                    // onChange={handleSheetChange}
                    backgroundStyle={{ backgroundColor: 'lightgray' }}>
                    <View style={styles.contentContainer}>
                        <View style={styles.bottomSheetOptionContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.bottomSheetIconContainer,
                                    { backgroundColor: 'purple' },
                                ]}
                                onPress={selectFromGallery}
                                activeOpacity={0.6}>
                                <Ionicons
                                    name="image"
                                    size={30}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <Text style={styles.bottomSheetOptionText}>
                                Gallery
                            </Text>
                        </View>
                        <View style={styles.bottomSheetOptionContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.bottomSheetIconContainer,
                                    { backgroundColor: 'red' },
                                ]}
                                onPress={selectFromCamera}
                                activeOpacity={0.6}>
                                <Ionicons
                                    name="camera"
                                    size={30}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <Text style={styles.bottomSheetOptionText}>
                                Camera
                            </Text>
                        </View>
                    </View>
                </BottomSheet>

                {/* touch to hide keyboard & bottomsheet */}
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss();
                        if (sheetRef.current) {
                            handleClosePress();
                        }
                    }}>
                    <View
                        style={[styles.modalBg, StyleSheet.absoluteFillObject]}
                    />
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
