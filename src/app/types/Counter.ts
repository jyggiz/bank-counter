import { COUNTER_STATUS } from './CounterStatus';

export type Counter = {
  status: COUNTER_STATUS;
  currentClient: number;
  processingClients: number[];
};
