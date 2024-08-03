import { COUNTER_STATUS } from '../types/CounterStatus';
import { dispatchCounterUpdateEvent } from '../utils/customEvents/dispatchCounterUpdateEvent';

export class Counter {
  private timeout: number;
  private intervalReference: NodeJS.Timeout | null = null;
  private priority: number;
  private processingClients: number[] = [];
  private _status: COUNTER_STATUS = COUNTER_STATUS.IDLE;
  public _currentClient: number = 0;
  private handleCounter: () => number | undefined;

  constructor(timeout: number, handleCounter: () => number | undefined, priority: number) {
    this.timeout = timeout;
    this.priority = priority;
    this.handleCounter = handleCounter;

    this.start();
  }

  public start() {
    const currentClient = this.handleCounter();

    if (currentClient === undefined) {
      return;
    }

    this.currentClient = currentClient;
    this.status = COUNTER_STATUS.PROCESSING;

    this.intervalReference = setInterval(() => {
      this.addProcessingClient(this.currentClient);

      const currentClient = this.handleCounter();

      if (currentClient === undefined) {
        this.status = COUNTER_STATUS.IDLE;

        if (this.intervalReference !== null) {
          clearInterval(this.intervalReference);
          this.intervalReference = null;
        }

        return;
      }

      this.currentClient = currentClient;
    }, this.timeout);
  }

  private get currentClient(): number {
    return this._currentClient;
  }

  private set currentClient(nextCurrentClient: number) {
    this._currentClient = nextCurrentClient;
    dispatchCounterUpdateEvent({ currentClient: nextCurrentClient, triggeredCounterIndex: this.priority });
  }

  private get status(): COUNTER_STATUS {
    return this._status;
  }

  private set status(nextStatus: COUNTER_STATUS) {
    this._status = nextStatus;
    dispatchCounterUpdateEvent({ status: nextStatus, triggeredCounterIndex: this.priority });
  }

  private addProcessingClient(processingClient: number): void {
    this.processingClients.push(processingClient);
    dispatchCounterUpdateEvent({ processingClients: this.processingClients, triggeredCounterIndex: this.priority });
  }

  public isIdle(): boolean {
    return this.status === COUNTER_STATUS.IDLE;
  }

  public isProcessing(): boolean {
    return this.status === COUNTER_STATUS.PROCESSING;
  }

  public destroy() {
    if (this.status !== COUNTER_STATUS.IDLE) {
      this.status = COUNTER_STATUS.IDLE;
    }

    if (this.intervalReference === null) {
      return;
    }

    clearInterval(this.intervalReference);
    this.intervalReference = null;
  }
}
