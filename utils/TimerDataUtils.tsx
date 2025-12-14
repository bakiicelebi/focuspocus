export const createTimerSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36)}`;
};
