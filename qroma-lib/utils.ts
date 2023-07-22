
export const sleep = async (waitTime: number) =>
  new Promise(resolve => setTimeout(resolve, waitTime)
);

