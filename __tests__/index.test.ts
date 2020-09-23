import "jest";
import range from "lodash/range";
import asyncBatch from "index";

describe('asyncBatch', () => {
  test('empty batch', async () => {
    const input: number[] = [];
    const expectedResult: number[] = [];

    const result = await asyncBatch(
      input,
      (t) => (new Promise((r) => r())),
      5,
    );

    expect(result).toEqual(expectedResult);
  });

  test('Async inverse', async () => {
    const input: number[] = range(0, 32);
    const expectedResult: number[] = range(0, -32);

    const result = await asyncBatch(
      input,
      (t) => (new Promise(
        (resolve) => setTimeout(() => resolve(t*-1 + 0), 1)
      )),
      2,
    );

    expect(result).toEqual(expectedResult);
  });

  test('Square Heavy Tasks', async () => {
    const input = [10, 2, 3, 8, 1, 7, 4];
    const expectedResult: number[] = [100, 4, 9, 64, 1, 49, 16];
    const processingOrder: number[] = [];
    const expectedProcessingOrder: number[] = [2, 3, 10, 1, 8, 4, 7];

    const result = await asyncBatch(
      input,
      (t) => new Promise(
        (resolve) => setTimeout(
          () => processingOrder.push(t) && resolve(t*t),
          t*25,
        ),
      ),
      2,
    );

    expect(result).toEqual(expectedResult);
    expect(processingOrder).toEqual(expectedProcessingOrder);
  });

  test('task and worker index', async () => {
    const input: number[] = range(0, 2);
    const subject = () => asyncBatch(
      input,
      async (t, taskIndex, workerIndex) => {
        expect(t).toEqual(taskIndex);
        expect(taskIndex).toEqual(workerIndex);
        return t;
      },
      5,
    );

    await expect(subject()).resolves.toEqual(input);
  });

  test('worker count minimum', async () => {
    await expect(
      asyncBatch([1], (t) => new Promise((r) => r(t)), 0),
    ).resolves.toEqual([1]);
  });
});
