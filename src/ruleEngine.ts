export type PolicyRule = (...args: unknown[]) => boolean;

export type CompositionStrategy = 'override' | 'intersection' | 'union' | 'merge';

export const createAllowListRule = (allowedConditions: PolicyRule[]): PolicyRule =>
  (...args: unknown[]) => allowedConditions.some((condition) => condition(...args));

export const createDenyAllRule = (): PolicyRule => () => false;

export const createAllowAllRule = (): PolicyRule => () => true;

export const overrideCompose = (primary: PolicyRule): PolicyRule =>
  (...args: unknown[]) => {
    return primary(...args);
  };

export const andCompose = (rule1: PolicyRule, rule2: PolicyRule): PolicyRule =>
  (...args: unknown[]) => rule1(...args) && rule2(...args);

export const orCompose = (rule1: PolicyRule, rule2: PolicyRule): PolicyRule =>
  (...args: unknown[]) => rule1(...args) || rule2(...args);

export const mergeCompose = (rules: PolicyRule[]): PolicyRule =>
  (...args: unknown[]) => rules.some((rule) => rule(...args));

export const composeRules = (
  strategy: CompositionStrategy,
  rules: PolicyRule[]
): PolicyRule => {
  if (rules.length === 0) {
    return createAllowAllRule();
  }

  switch (strategy) {
    case 'override':
      return rules[0]!;
    case 'intersection':
      return rules.reduce((acc, rule) => andCompose(rule, acc));
    case 'union':
      return rules.reduce((acc, rule) => orCompose(rule, acc));
    case 'merge':
      return mergeCompose(rules);
  }
};
