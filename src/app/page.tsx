'use client';

import { Button, Flex, Text, Theme } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

import '@radix-ui/themes/styles.css';

import CounterTable from './components/counter-table/CounterTable';
import Form, { HandleSubmitProps } from './components/form/Form';
import { useCounters } from './hooks/useCounter';
import { useWaitingClients } from './hooks/useWaitingClients';
import { QueueApp } from './models/queueApp';

const COUNTER_COUNT = 4;

export default function Home() {
  const [queue, setQueue] = useState<QueueApp | null>(null);
  const { counters, resetCounters } = useCounters(COUNTER_COUNT);
  const waitingClientCount = useWaitingClients();

  function onNewClientButtonClick(): void {
    queue?.addClient();
  }

  function handleSubmit({ countersConfigList, startNumber }: HandleSubmitProps): void {
    queue?.destroy();
    resetCounters();

    setQueue(new QueueApp(countersConfigList, startNumber));
  }

  useEffect(() => {
    return () => {
      queue?.destroy();
    };
  }, [queue]);

  return (
    <Theme>
      <Flex align="center" direction="column" justify="center" maxWidth="1000px" mx="auto" my="0">
        <CounterTable counters={counters} />
        <Text mt="4">Number of people waiting: {waitingClientCount}</Text>
        <Button my="4" onClick={onNewClientButtonClick} disabled={queue === null}>
          Next {queue?.nextNewClientNumber || 1}
        </Button>
        <hr />
        <Form countersCount={COUNTER_COUNT} handleSubmit={handleSubmit} />
      </Flex>
    </Theme>
  );
}
