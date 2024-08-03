import { Counter } from '@/app/types/Counter';

type DispatchCounterUpdateEventProps = Partial<Counter> & { triggeredCounterIndex: number };

export function dispatchCounterUpdateEvent({
  triggeredCounterIndex,
  status,
  currentClient,
  processingClients,
}: DispatchCounterUpdateEventProps): void {
  window?.dispatchEvent(
    new CustomEvent(`COUNTER_UPDATE_${triggeredCounterIndex}`, {
      detail: {
        ...(!status === undefined ? {} : { status }),
        ...(!currentClient === undefined ? {} : { currentClient }),
        ...(!processingClients === undefined ? {} : { processingClients }),
        ...(!status ? {} : { status }),
        triggeredCounterIndex,
      },
    })
  );
}
