(function (root) {
  'use strict';

  // Keep all lesson amounts independent of the canvas and saved game state.
  function amount(value) {
    return Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  }

  function checkNumber(value, name, minimum) {
    if (!Number.isFinite(value) || value < minimum) {
      throw new RangeError(name + ' must be a finite number of at least ' + minimum);
    }
  }

  function checkYears(years, startYear) {
    if (!Number.isInteger(years) || years < 1) {
      throw new RangeError('years must be a positive integer');
    }
    if (!Number.isInteger(startYear)) {
      throw new RangeError('startYear must be an integer');
    }
  }

  function checkResidual(cost, residual) {
    checkNumber(cost, 'cost', 0);
    checkNumber(residual, 'residual', 0);
    if (residual > cost) throw new RangeError('residual cannot exceed cost');
  }

  function money(value) {
    checkNumber(Math.abs(value), 'value', 0);
    const formatted = new Intl.NumberFormat('en-HK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Math.abs(value));
    return (value < 0 ? '-$' : '$') + formatted;
  }

  function straight({ price = 48000, transport = 2000, installation = 4000,
    residual = 6000, years = 4, startYear = 2026 } = {}) {
    checkNumber(price, 'price', 0);
    checkNumber(transport, 'transport', 0);
    checkNumber(installation, 'installation', 0);
    const cost = amount(price + transport + installation);
    checkResidual(cost, residual);
    checkYears(years, startYear);
    const depreciable = amount(cost - residual);
    const annual = amount(depreciable / years);
    const rows = Array.from({ length: years }, (_, index) => {
      const opening = amount(cost - annual * index);
      const accumulated = index === years - 1 ? depreciable : amount(annual * (index + 1));
      const closing = amount(cost - accumulated);
      return {
        year: startYear + index,
        opening,
        depreciation: amount(opening - closing),
        accumulated,
        closing
      };
    });
    return {
      cost, residual, depreciable, annual, years, rows,
      formula: 'Annual depreciation = (cost − estimated residual value) ÷ estimated useful life'
    };
  }

  function reducing({ cost = 160000, rate = 0.5, years = 4,
    usefulLife = 5, residual = 10000, startYear = 2026 } = {}) {
    checkResidual(cost, residual);
    checkNumber(rate, 'rate', 0);
    if (rate > 1) throw new RangeError('rate cannot exceed 1');
    checkYears(years, startYear);
    if (!Number.isInteger(usefulLife) || usefulLife < 1) {
      throw new RangeError('usefulLife must be a positive integer');
    }
    if (years > usefulLife) throw new RangeError('years cannot exceed usefulLife');
    const depreciable = amount(cost - residual);
    let closing = cost;
    let accumulated = 0;
    const rows = Array.from({ length: years }, (_, index) => {
      const opening = closing;
      const finalYear = index + 1 === usefulLife;
      // The final useful year writes off the remaining depreciable balance.
      // A shortened display horizon must not trigger this adjustment early.
      const depreciation = amount(finalYear
        ? opening - residual
        : Math.min(opening * rate, opening - residual));
      accumulated = finalYear ? depreciable : amount(accumulated + depreciation);
      closing = finalYear ? residual : amount(cost - accumulated);
      return { year: startYear + index, opening, depreciation, accumulated, closing, finalYear };
    });
    return {
      cost, residual, depreciable, rate, years, usefulLife, rows,
      formula: 'Annual depreciation = opening carrying amount × fixed rate, limited to the amount above residual value. In the final year of useful life: opening carrying amount − estimated residual value.'
    };
  }

  function usage({ cost = 54000, residual = 6000, totalUsage = 12000,
    usages = [3000, 4500, 0, 4500], startYear = 2026 } = {}) {
    checkResidual(cost, residual);
    checkNumber(totalUsage, 'totalUsage', Number.MIN_VALUE);
    if (!Array.isArray(usages) || usages.length === 0) {
      throw new RangeError('usages must be a non-empty array');
    }
    checkYears(usages.length, startYear);
    usages.forEach(value => checkNumber(value, 'usage', 0));
    const depreciable = amount(cost - residual);
    const perUse = amount(depreciable / totalUsage);
    let closing = cost;
    let accumulated = 0;
    const rows = usages.map((used, index) => {
      const opening = closing;
      // Residual value is retained even when actual usage exceeds the estimate.
      const depreciation = amount(Math.min(depreciable - accumulated, used * perUse));
      accumulated = amount(accumulated + depreciation);
      closing = amount(cost - accumulated);
      return {
        year: startYear + index, opening, usage: used,
        depreciation, accumulated, closing
      };
    });
    return {
      cost, residual, depreciable, totalUsage, perUse, years: usages.length, rows,
      formula: 'Annual depreciation = (cost − estimated residual value) ÷ estimated total usage × actual usage for the year'
    };
  }

  function allowedModes(trainingComplete, straightComplete = false) {
    if (!trainingComplete) return ['free'];
    if (!straightComplete) return ['free', 'straight'];
    return ['free', 'straight', 'reducing', 'usage'];
  }

  const api = Object.freeze({ money, straight, reducing, usage, allowedModes });
  root.Accounting = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
