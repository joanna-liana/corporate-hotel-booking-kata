import {
  andCompose,
  composeRules,
  createAllowAllRule,
  createAllowListRule,
  createDenyAllRule,
  mergeCompose,
  orCompose,
  overrideCompose,
} from './ruleEngine';

describe('ruleEngine', () => {

  describe('createAllowListRule', () => {
    it('allows when any predicate matches', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const rule = createAllowListRule([isStandard, isJunior]);

      // when, then
      expect(rule('standard')).toBe(true);
      expect(rule('junior')).toBe(true);
    });

    it('denies when no predicate matches', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const rule = createAllowListRule([isStandard, isJunior]);

      // when, then
      expect(rule('suite')).toBe(false);
    });
  });

  describe('createDenyAllRule', () => {
    it('denies all room types', () => {
      // given
      const rule = createDenyAllRule();

      // when, then
      expect(rule('standard')).toBe(false);
      expect(rule('suite')).toBe(false);
    });
  });

  describe('createAllowAllRule', () => {
    it('allows all room types', () => {
      // given
      const rule = createAllowAllRule();

      // when, then
      expect(rule('standard')).toBe(true);
      expect(rule('suite')).toBe(true);
    });
  });

  describe('overrideCompose', () => {
    it('uses primary rule when it returns true', () => {
      // given
      const isSuite = (roomType: unknown) => roomType === 'suite';
      const primary = createAllowListRule([isSuite]);

      // when
      const isSatisfied = overrideCompose(primary);

      // then
      expect(isSatisfied('suite')).toBe(true);
    });

    it('uses primary rule when it returns false', () => {
      // given
      const isSuite = (roomType: unknown) => roomType === 'suite';
      const primary = createAllowListRule([isSuite]);

      // when
      const isSatisfied = overrideCompose(primary);

      // then
      expect(isSatisfied('standard')).toBe(false);
    });

    it('uses primary rule even when it denies', () => {
      // given
      const primary = createDenyAllRule();

      // when
      const isSatisfied = overrideCompose(primary);

      // then
      expect(isSatisfied('standard')).toBe(false);
    });
  });

  describe('andCompose', () => {
    it('allows when both rules allow', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const isSuite = (roomType: unknown) => roomType === 'suite';
      const rule1 = createAllowListRule([isStandard, isJunior, isSuite]);
      const rule2 = createAllowListRule([isStandard, isJunior]);

      // when
      const isSatisfied = andCompose(rule1, rule2);

      // then
      expect(isSatisfied('standard')).toBe(true);
      expect(isSatisfied('junior')).toBe(true);
    });

    it('denies when one rule denies', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const isSuite = (roomType: unknown) => roomType === 'suite';
      const rule1 = createAllowListRule([isStandard, isJunior, isSuite]);
      const rule2 = createAllowListRule([isStandard, isJunior]);

      // when
      const isSatisfied = andCompose(rule1, rule2);

      // then
      expect(isSatisfied('suite')).toBe(false);
    });

    it('denies when both rules deny', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const rule1 = createAllowListRule([isStandard]);
      const rule2 = createAllowListRule([isJunior]);

      // when
      const isSatisfied = andCompose(rule1, rule2);

      // then
      expect(isSatisfied('suite')).toBe(false);
    });
  });

  describe('orCompose', () => {
    it('allows when first rule allows', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const isSuite = (roomType: unknown) => roomType === 'suite';
      const rule1 = createAllowListRule([isStandard, isJunior]);
      const rule2 = createAllowListRule([isSuite]);

      // when
      const isSatisfied = orCompose(rule1, rule2);

      // then
      expect(isSatisfied('standard')).toBe(true);
    });

    it('allows when second rule allows', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const isSuite = (roomType: unknown) => roomType === 'suite';
      const rule1 = createAllowListRule([isStandard, isJunior]);
      const rule2 = createAllowListRule([isSuite]);

      // when
      const isSatisfied = orCompose(rule1, rule2);

      // then
      expect(isSatisfied('suite')).toBe(true);
    });

    it('denies when both rules deny', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const rule1 = createAllowListRule([isStandard]);
      const rule2 = createAllowListRule([isJunior]);

      // when
      const isSatisfied = orCompose(rule1, rule2);

      // then
      expect(isSatisfied('suite')).toBe(false);
    });
  });

  describe('mergeCompose', () => {
    it('allows when any rule allows', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const isSuite = (roomType: unknown) => roomType === 'suite';
      const rule1 = createAllowListRule([isStandard]);
      const rule2 = createAllowListRule([isJunior]);
      const rule3 = createAllowListRule([isSuite]);

      // when
      const isSatisfied = mergeCompose([rule1, rule2, rule3]);

      // then
      expect(isSatisfied('standard')).toBe(true);
      expect(isSatisfied('junior')).toBe(true);
      expect(isSatisfied('suite')).toBe(true);
    });

    it('denies when all rules deny', () => {
      // given
      const isStandard = (roomType: unknown) => roomType === 'standard';
      const isJunior = (roomType: unknown) => roomType === 'junior';
      const rule1 = createAllowListRule([isStandard]);
      const rule2 = createAllowListRule([isJunior]);

      // when
      const isSatisfied = mergeCompose([rule1, rule2]);

      // then
      expect(isSatisfied('suite')).toBe(false);
    });
  });

  describe('composeRules', () => {
    const isStandard = (roomType: unknown) => roomType === 'standard';
    const isJunior = (roomType: unknown) => roomType === 'junior';
    const isSuite = (roomType: unknown) => roomType === 'suite';

    describe('when strategy is override', () => {
      it('uses first rule only, ignoring others', () => {
        // given
        const rule1 = createAllowListRule([isSuite]);
        const rule2 = createAllowListRule([isStandard, isJunior]);

        // when
        const isSatisfied = composeRules('override', [rule1, rule2]);

        // then
        expect(isSatisfied('suite')).toBe(true);
        expect(isSatisfied('standard')).toBe(false);
      });

      it('uses first rule even when it denies', () => {
        // given
        const rule1 = createDenyAllRule();
        const rule2 = createAllowListRule([isStandard]);
        const rule3 = createAllowListRule([isJunior]);

        // when
        const isSatisfied = composeRules('override', [rule1, rule2, rule3]);

        // then
        expect(isSatisfied('standard')).toBe(false);
      });
    });

    describe('when strategy is intersection', () => {
      it('allows only room types in all policies', () => {
        // given
        const rule1 = createAllowListRule([isStandard, isJunior, isSuite]);
        const rule2 = createAllowListRule([isStandard, isJunior]);

        // when
        const isSatisfied = composeRules('intersection', [rule1, rule2]);

        // then
        expect(isSatisfied('standard')).toBe(true);
        expect(isSatisfied('junior')).toBe(true);
        expect(isSatisfied('suite')).toBe(false);
      });

      it('denies when no common room types', () => {
        // given
        const rule1 = createAllowListRule([isStandard]);
        const rule2 = createAllowListRule([isSuite]);

        // when
        const isSatisfied = composeRules('intersection', [rule1, rule2]);

        // then
        expect(isSatisfied('standard')).toBe(false);
        expect(isSatisfied('suite')).toBe(false);
      });
    });

    describe('when strategy is union', () => {
      it('allows room types from any policy', () => {
        // given
        const rule1 = createAllowListRule([isStandard, isJunior]);
        const rule2 = createAllowListRule([isSuite]);

        // when
        const isSatisfied = composeRules('union', [rule1, rule2]);

        // then
        expect(isSatisfied('standard')).toBe(true);
        expect(isSatisfied('junior')).toBe(true);
        expect(isSatisfied('suite')).toBe(true);
      });

      it('denies room types not in any policy', () => {
        // given
        const rule1 = createAllowListRule([isStandard]);
        const rule2 = createAllowListRule([isJunior]);

        // when
        const isSatisfied = composeRules('union', [rule1, rule2]);

        // then
        expect(isSatisfied('suite')).toBe(false);
      });
    });

    describe('when strategy is merge', () => {
      it('allows room types from any policy', () => {
        // given
        const rule1 = createAllowListRule([isStandard]);
        const rule2 = createAllowListRule([isJunior]);
        const rule3 = createAllowListRule([isSuite]);

        // when
        const isSatisfied = composeRules('merge', [rule1, rule2, rule3]);

        // then
        expect(isSatisfied('standard')).toBe(true);
        expect(isSatisfied('junior')).toBe(true);
        expect(isSatisfied('suite')).toBe(true);
      });
    });

    describe('when no rules provided', () => {
      it('allows all room types', () => {
        // when
        const isSatisfied = composeRules('override', []);

        // then
        expect(isSatisfied('standard')).toBe(true);
        expect(isSatisfied('suite')).toBe(true);
      });
    });
  });

  describe('real-world examples', () => {
    const isStandard = (roomType: unknown) => roomType === 'standard';
    const isJunior = (roomType: unknown) => roomType === 'junior';
    const isSuite = (roomType: unknown) => roomType === 'suite';

    describe('employee policy overrides company policy', () => {
      it('allows employee-specific room types even if not in company policy', () => {
        // given
        const companyPolicy = createAllowListRule([isStandard, isJunior]);
        const employeePolicy = createAllowListRule([isSuite]);

        // when
        const isSatisfied = composeRules('override', [employeePolicy, companyPolicy]);

        // then
        expect(isSatisfied('suite')).toBe(true);
        expect(isSatisfied('standard')).toBe(false);
      });
    });

    describe('restrictive employee policy', () => {
      it('further restricts company policy using intersection', () => {
        // given
        const companyPolicy = createAllowListRule([isStandard, isJunior, isSuite]);
        const employeePolicy = createAllowListRule([isStandard]);

        // when
        const isSatisfied = composeRules('intersection', [companyPolicy, employeePolicy]);

        // then
        expect(isSatisfied('standard')).toBe(true);
        expect(isSatisfied('junior')).toBe(false);
        expect(isSatisfied('suite')).toBe(false);
      });
    });

    describe('privileged employee gets additional room types', () => {
      it('combines company and employee policies using union', () => {
        // given
        const companyPolicy = createAllowListRule([isStandard]);
        const employeePolicy = createAllowListRule([isSuite]);

        // when
        const isSatisfied = composeRules('union', [companyPolicy, employeePolicy]);

        // then
        expect(isSatisfied('standard')).toBe(true);
        expect(isSatisfied('suite')).toBe(true);
      });
    });

    describe('multiple employee exceptions', () => {
      it('merges all exception policies', () => {
        // given
        const companyPolicy = createAllowListRule([isStandard]);
        const exception1 = createAllowListRule([isJunior]);
        const exception2 = createAllowListRule([isSuite]);

        // when
        const isSatisfied = composeRules('merge', [
          companyPolicy,
          exception1,
          exception2,
        ]);

        // then
        expect(isSatisfied('standard')).toBe(true);
        expect(isSatisfied('junior')).toBe(true);
        expect(isSatisfied('suite')).toBe(true);
      });
    });
  });
});
