const asyncBatch = async <TaskType, ResultType>(
  tasks: TaskType[],
  handler: (task: TaskType) => Promise<ResultType>,
  _workers: number,
): Promise<ResultType[]> => {
  const workersCount = Math.floor(_workers);
  if (workersCount < 1) {
    throw new Error("The value of 'workers' must be at least 1");
  }

  const workers = new Array(workersCount);
  for (let i = 0; i < workersCount; i++) {
    workers[i] = i;
  }

  const results: ResultType[] = [];
  let i = 0;
  await Promise.all(workers.map(async () => {
    while (i < tasks.length) {
      const taskId = i;
      i++;
      results[taskId] = await handler(tasks[taskId]);
    }
  }));
  return results;
};

export default asyncBatch;
