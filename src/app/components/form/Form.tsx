'use client';

import { Button, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

import { CounterConfig } from '../../types/CounterConfig';

export type HandleSubmitProps = {
  countersConfigList: readonly CounterConfig[];
  startNumber: number;
};

type FormProps = {
  countersCount: number;
  handleSubmit: (handleSubmitProps: HandleSubmitProps) => void;
};

function createEmptyCountersConfigList(countersCount: number): readonly CounterConfig[] {
  return Array.from({ length: countersCount }).map(() => ({
    timeout: 0,
  }));
}

const MIN_COUNTER_PROCESS_DURATION_SECONDS = 2;
const MAX_COUNTER_PROCESS_DURATION_SECONDS = 5;

function isCounterProcessDurationValid(counterProcessDuration: number): boolean {
  return (
    counterProcessDuration >= MIN_COUNTER_PROCESS_DURATION_SECONDS &&
    counterProcessDuration <= MAX_COUNTER_PROCESS_DURATION_SECONDS
  );
}

export default function Form({ countersCount, handleSubmit }: FormProps) {
  const [countersConfigList, setCountersConfigList] = useState<readonly CounterConfig[]>(() =>
    createEmptyCountersConfigList(countersCount)
  );
  const [startNumber, setStartNumber] = useState<number>(0);

  const isFormFilled = useMemo(
    () => countersConfigList.every(({ timeout }) => isCounterProcessDurationValid(timeout)) && startNumber !== 0,
    [startNumber, countersConfigList]
  );

  function onCounterChangeByIndex(event: ChangeEvent<HTMLInputElement>, index: number): void {
    const value = parseInt(event.target.value);

    setCountersConfigList((counterConfigList) => {
      const tempCounters = [...counterConfigList];
      tempCounters[index] = { ...tempCounters[index], timeout: isNaN(value) ? 0 : value };

      return tempCounters;
    });
  }

  function onStartNumberChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = parseInt(event.target.value);

    setStartNumber(isNaN(value) || value < 1 ? 0 : value);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!isFormFilled) {
      return;
    }

    handleSubmit({ countersConfigList, startNumber });
  }

  return (
    <>
      <Heading mb="4" size="8" as="h2">
        Set Initial State
      </Heading>
      <form onSubmit={onSubmit}>
        {countersConfigList.map((_, index) => (
          <Flex key={`counter-${index}-input`} mb="4" justify="between">
            <Text as="label" htmlFor={`counter-${index + 1}`}>
              Counter {index + 1} Processing Time:{' '}
            </Text>
            <TextField.Root
              min={MIN_COUNTER_PROCESS_DURATION_SECONDS}
              max={MAX_COUNTER_PROCESS_DURATION_SECONDS}
              ml="4"
              type="number"
              id={`counter-${index}`}
              onChange={(event) => onCounterChangeByIndex(event, index)}
              style={{ width: '30px' }}
            />
          </Flex>
        ))}
        <Flex mb="4" justify="between">
          <Text as="label" htmlFor="start-number-field">
            Start Number:{' '}
          </Text>
          <TextField.Root ml="4" type="number" id="start-number-field" onChange={onStartNumberChange} min="1" />
        </Flex>
        <Text mb="4">Processing time can only be equal to {'2<=x<=5'}</Text>
        <Button type="submit" disabled={!isFormFilled}>
          Change Init
        </Button>
      </form>
    </>
  );
}
