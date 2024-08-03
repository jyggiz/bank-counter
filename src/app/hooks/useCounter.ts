import { useEffect, useState } from 'react';

import { Counter } from '../types/Counter';
import { COUNTER_STATUS } from '../types/CounterStatus';
import { createArrayByLength } from '../utils/createArrayByLength';
import { getCounterCustomEventNameByIndex } from '../utils/getCounterCustomEventNameByIndex';

function createDefaultCounterList(countersCount: number): readonly Counter[] {
  return createArrayByLength(countersCount).fill({
    status: COUNTER_STATUS.IDLE,
    currentClient: 0,
    processingClients: [],
  }) as readonly Counter[];
}

export function useCounters(countersCount: number) {
  const [counters, setCounters] = useState<readonly Counter[]>(() => createDefaultCounterList(countersCount));

  useEffect(() => {
    function handleCounterUpdate(event: any) {
      const {
        detail: {
          status: nextStatus = undefined,
          currentClient: nextCurrentClient,
          processingClients: nextProcessingClients,
          triggeredCounterIndex,
        },
      } = event;
      setCounters((counters) => {
        const tempCounters = [...counters];
        const oldTriggeredCounter = tempCounters[triggeredCounterIndex];

        tempCounters[triggeredCounterIndex] = {
          status: nextStatus || oldTriggeredCounter.status,
          currentClient: nextCurrentClient || oldTriggeredCounter.currentClient,
          processingClients: nextProcessingClients || oldTriggeredCounter.processingClients,
        };

        return tempCounters;
      });
    }

    const countersEmptyList = createArrayByLength(countersCount);

    countersEmptyList.forEach((_, index) => {
      window.addEventListener(getCounterCustomEventNameByIndex(index), handleCounterUpdate);
    });

    return () => {
      countersEmptyList.forEach((_, index) => {
        window.removeEventListener(getCounterCustomEventNameByIndex(index), handleCounterUpdate);
      });
    };
  }, [countersCount]);

  function resetCounters(): void {
    setCounters(createDefaultCounterList(countersCount));
  }

  return {
    counters,
    resetCounters,
  };
}
