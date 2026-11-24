export const choice = (id, label, outcomes, requires = null) => ({
  id,
  label,
  outcomes,
  ...(requires ? { requires } : {}),
});

export const outcome = (id, text, effects = {}, weight = 100, modifiers = []) => ({
  id,
  text,
  effects,
  weight,
  modifiers,
});

export const modifier = (when, weight) => ({ when, weight });
