import { CounterConfig } from '../types/CounterConfig';
import { dispatchWaitingClientUpdateEvent } from '../utils/customEvents/dispatchWaitingClientUpdateEvent';
import { Counter } from './Counter';

export class QueueApp {
  private clients: number[];
  private countersConfigs: readonly CounterConfig[];
  private _counters: readonly Counter[] = [];

  public nextNewClientNumber: number;

  constructor(countersConfigs: readonly CounterConfig[], clientsCount: number) {
    this.countersConfigs = countersConfigs;
    this.clients = Array.from({ length: clientsCount }).map((_, index) => index + 1);
    this.nextNewClientNumber = this.clients[this.clients.length - 1] + 1;

    this.startCounters();
  }

  private get counters(): readonly Counter[] {
    return this._counters;
  }

  private set counters(counters: readonly Counter[]) {
    this._counters = counters;
  }

  public addClient(): void {
    this.clients.push(this.nextNewClientNumber);
    this.nextNewClientNumber += 1;

    dispatchWaitingClientUpdateEvent(this.clients.length);

    this.rerunIdledCounters();
  }

  private processClient(currentCounterIndex: number): number | undefined {
    if (this.clients.length === 0) {
      if (this.areAllCountersIdled(currentCounterIndex)) {
        this.destroy();
      }

      return;
    } else {
      const currentProcessingClient = this.clients.shift();

      dispatchWaitingClientUpdateEvent(this.clients.length);

      return currentProcessingClient;
    }
  }

  private startCounters() {
    this.counters = this.countersConfigs.map(
      (counter, priority) => new Counter(counter.timeout * 1000, () => this.processClient(priority), priority)
    );
  }

  private rerunIdledCounters() {
    this.counters.forEach((counter) => {
      if (counter.isIdle()) {
        counter.start();
      }
    });
  }

  private areAllCountersIdled(currentCounterIndex: number) {
    return this.counters.filter((_, index) => index !== currentCounterIndex).every((counter) => counter.isIdle());
  }

  public destroy() {
    this.counters.forEach((counter) => {
      counter.destroy();
    });
  }
}
