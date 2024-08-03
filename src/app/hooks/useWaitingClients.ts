import { useEffect, useState } from 'react';

import { CustomEvents } from '../constants/customEvents';

export function useWaitingClients(): number {
  const [waitingClientCount, setWaitingClientCount] = useState<number>(0);

  useEffect(() => {
    function handleWaitingClient(event: any) {
      const {
        detail: { waitingClientsCount: nextWaitingClientsCount },
      } = event;

      if (nextWaitingClientsCount === waitingClientCount) {
        return;
      }

      setWaitingClientCount(nextWaitingClientsCount);
    }

    window.addEventListener(CustomEvents.WAITING_CLIENT_UPDATE, handleWaitingClient);

    return () => {
      window.removeEventListener(CustomEvents.WAITING_CLIENT_UPDATE, handleWaitingClient);
    };
  });

  return waitingClientCount;
}
