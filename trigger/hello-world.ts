import { task, wait } from "@trigger.dev/sdk";

export const helloWorld = task({
  //1. Use a unique id for each task
  id: "hello-world",
  queue: {
    concurrencyLimit: 1,
  },
  //2. The run function is the main function of the task
  run: async (payload: { message: string }) => {
    //3. You can write code that runs for a long time here, there are no timeouts
    await wait.for({ seconds: 30 });
    console.log(payload.message);
  },
});
