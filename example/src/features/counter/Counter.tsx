import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './slice'
import { Button, Text } from 'react-native';

const Counter = (): JSX.Element => {
  // @ts-ignore
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()

  const incrementCounter = useCallback(() => {
    dispatch(increment());
  }, [dispatch]);

  const decrementCounter = useCallback(() => {
    dispatch(decrement());
  }, [dispatch]);

  return (
    <>
      {/* @ts-ignore */}
        <Button
          title="Increment"
          onPress={incrementCounter}
        />
      {/* @ts-ignore */}
        <Text>{count}</Text>
      {/* @ts-ignore */}
        <Button
          title="Decrement"
          onPress={decrementCounter}
        />
    </>
  )
}

export default Counter;
