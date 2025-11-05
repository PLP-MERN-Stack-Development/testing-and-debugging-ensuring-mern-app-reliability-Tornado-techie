// This file contains intentional bugs for debugging practice

export const buggyFunction1 = (data) => {
  // Bug: No null check
  return data.items.length; // Will crash if data is null/undefined
};

export const buggyFunction2 = (a, b) => {
  // Bug: Incorrect variable name
  return a + c; // 'c' is not defined
};

export const buggyAsyncFunction = async () => {
  // Bug: Unhandled promise rejection
  const result = await Promise.reject(new Error('Intentional error'));
  return result;
};