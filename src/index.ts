const asyncBatch = async <TaskType, ResultType>(
  tasks: TaskType[],
  handler: (task: TaskType, taskIndex: number, workerIndex: number) => Promise<ResultType>,
  desiredWorkers: number,
): Promise<ResultType[]> => {
  // Cap workers count to task list size, with a min of 1 worker
  const workersCount = Math.max(Math.floor(Math.min(desiredWorkers, tasks.length)), 1);

  const results: ResultType[] = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: workersCount }).map(async (w, workerIndex) => {
      while (i < tasks.length) {
        const taskIndex = i;
        i++;
        results[taskIndex] = await handler(tasks[taskIndex], taskIndex, workerIndex);
      }
    }),
  );
  return results;
};

export default asyncBatch;
