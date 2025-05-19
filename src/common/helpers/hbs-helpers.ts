// src/common/helpers/hbs-helpers.ts
import * as hbs from 'hbs';

export function registerHandlebarsHelpers() {
  hbs.registerHelper('ifEquals', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper('capitalize', function (text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  });

  hbs.registerHelper('lookup', function (obj, field) {
    return obj?.[field];
  });

  hbs.registerHelper('length', function (arr) {
    return arr?.length || 0;
  });

  hbs.registerHelper('add', function (a, b) {
    return a + b;
  });
}
