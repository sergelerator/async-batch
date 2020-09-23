# async-batch

[![Build Status](https://travis-ci.org/sergelerator/async-batch.svg?branch=master)](https://travis-ci.org/sergelerator/async-batch)

Asynchronously process task batches.

## Usage

async-batch shines when you need to process several potentially taxing tasks in terms of computing resources. Some sample use cases:

  - Automated calls to a rate-limited API.
  - I/O heavy operations.
  - Throttling calls to a service running on devices with a small amount of computing resources.

The package exports a single function, `asyncBatch`, which expects three parameters:

  - A list of tasks. Tasks can be anything (numbers, objects, lists, etc.)
  - A handler function to run the tasks.
  - The number of concurrent workers to run tasks on.

The following code snippet showcases how to use it:

```typescript
import asyncBatch from "async-batch";

async function squares() {
  const input = [10, 2, 3, 8, 1, 7, 4];
  const processingOrder: number[] = [];

  const result = await asyncBatch(
    input,
    (task: number, taskIndex: number, workerIndex: number) => new Promise(
      (resolve) => setTimeout(
        () => processingOrder.push(task) && resolve(task * task),
        task * 25,
      ),
    ),
    2,
  );

  console.log(processingOrder);   // [  2,  3, 10,  1,  8,  4,  7];
  console.log(result);            // [100,  4,  9, 64,  1, 49, 16];

  return result;
}

squares();
```

`asyncBatch` returns a `Promise` that resolves with the results of all tasks once all of them have been processed.

Tasks in the input list are **grabbed** in order, however, since each task can take different times to complete, the completion order is not guaranteed to be ordered in any way. Despite of this, the results list returned once `asyncBatch` resolves is guaranteed to preserve the order of the elements in a way that the result of processing the task at index X will always be found at index X in the results list.
