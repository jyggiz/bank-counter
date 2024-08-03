'use client';

import { Heading, Table, Text } from '@radix-ui/themes';

import { Counter } from '@/app/types/Counter';
import { COUNTER_STATUS } from '@/app/types/CounterStatus';

type CounterTableProps = {
  counters: readonly Counter[];
};

export default function CounterTable({ counters }: CounterTableProps) {
  return (
    <>
      <Heading mb="2" size="8" as="h1" id="bank-counter-table-heading">
        Bank Counter
      </Heading>
      <Table.Root aria-labelledby="bank-counter-table-heading">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Text>Counter</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text>Processing</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text>Processed</Text>
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {counters.map((counter, index) => (
            <Table.Row key={`tr-${index}`}>
              <Table.RowHeaderCell>
                <Text>Counter {index + 1}</Text>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Text>
                  {counter.status === COUNTER_STATUS.PROCESSING ? counter.currentClient : COUNTER_STATUS.IDLE}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text>{counter.processingClients.join(', ')}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
