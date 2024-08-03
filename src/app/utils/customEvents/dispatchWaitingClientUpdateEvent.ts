import { CustomEvents } from '@/app/constants/customEvents';

export function dispatchWaitingClientUpdateEvent(waitingClientsCount: number): void {
  window?.dispatchEvent(
    new CustomEvent(CustomEvents.WAITING_CLIENT_UPDATE, {
      detail: {
        waitingClientsCount,
      },
    })
  );
}
