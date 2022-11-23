import React, { useCallback } from 'react';
import { Button, Text } from 'react-native';
import { decrement, increment } from './slice';
import { useAppDispatch, useAppSelector } from '../../hooks';

const Counter = (): JSX.Element => {
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    const incrementCounter = useCallback(() => {
        dispatch(increment());
    }, [dispatch]);

    const decrementCounter = useCallback(() => {
        dispatch(decrement());
    }, [dispatch]);

    return (
        <>
            <Button title="Increment" onPress={incrementCounter} />
            <Text>{count}</Text>
            <Button title="Decrement" onPress={decrementCounter} />
        </>
    );
};

export default Counter;
