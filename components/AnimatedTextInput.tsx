// adapted from "Creating an Animated TextField with React Native"
// https://bilir.me/blog/creating-an-animated-textfield-with-react-native

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { StyleSheet, TextInput, View, Text, Animated, Easing, TouchableWithoutFeedback } from 'react-native';

type Props = React.ComponentProps<typeof TextInput> & {
    label: string
    errorText?: string | null
}

const AnimatedTextInput = forwardRef<TextInput, Props>(function AnimatedTextInput(props, ref) {

    const { 
        label, 
        style,
        errorText,
        value, 
        onBlur,
        onFocus,
        returnKeyType,
        ...restOfProps
    } = props;

    const [isFocused, setIsFocused] = useState(false);

    let color = isFocused ? '#EC6337' : '#D4D4F6';
    if (errorText) {
        color = '#B00020';
    }

    const focusAnimation = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        Animated.timing(focusAnimation, {
            toValue: isFocused || !!value ? 1 : 0,
            duration: 150,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
        }).start();
    }, [focusAnimation, isFocused, value]);

    useEffect(() => {
        if (ref) {
            if (typeof ref === 'function') {
                ref(inputRef.current);
            } else {
                ref.current = inputRef.current;
            }
        }
    }, [ref]);
    
    return (
        <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>

            <View style={style}>

                <TextInput
                    ref={inputRef}
                    style={[
                        styles.input,
                        {
                            borderColor: color,
                        }
                    ]}
                    {...restOfProps}
                    returnKeyType={returnKeyType || 'done'}
                    onBlur={(event) => {
                        setIsFocused(false);
                        onBlur?.(event);
                    }}
                    onFocus={(event) => {
                        setIsFocused(true);
                        onFocus?.(event);
                    }}
                />

                <Animated.View style={[styles.labelContainer, { 
                    transform: [
                        {
                        scale: focusAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75],
                        }),
                        },
                        {
                        translateY: focusAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [18, -2],
                        }),
                        },
                        {
                        translateX: focusAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, -14],
                        }),
                        },
                    ],
                    },
                ]}
                >
                    <Text 
                    style={
                        [styles.label, {
                            color,
                        }, 
                        ]
                        }>
                            {label}
                            {errorText ? '*' : ''}
                    </Text>
                </Animated.View>
                {!!errorText && <Text style={styles.error}>{errorText}</Text>}
            </View>
        </TouchableWithoutFeedback>
    )

});

const styles = StyleSheet.create({
    input: {
        paddingLeft: 10,
        height: 45,
        borderColor: '#EC6337',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 16,
    },
    labelContainer: {
        position: 'absolute',
        left: 16,
        top: -6,
        paddingHorizontal: 8,
        backgroundColor: '#FFFFFF',
    },
    label: {
        fontSize: 16,
    },
    error: {
        marginTop: 4,
        marginLeft: 12,
        fontSize: 12,
        color: '#B00020',
    },
});

export default AnimatedTextInput;