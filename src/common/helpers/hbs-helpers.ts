// src/common/helpers/hbs-helpers.ts
import * as hbs from 'hbs';

export function registerHandlebarsHelpers() {
  hbs.registerHelper('ifEquals', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper('ifUserImageField', function (model, field, options) {
    const imageFields = ['image', 'avatar', 'profilePicture'];
    return model === 'user' && imageFields.includes(field)
      ? options.fn(this)
      : options.inverse(this);
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

  // Logical OR
  hbs.registerHelper('or', function (...args) {
    const options = args.pop(); // last argument is the Handlebars options object
    return args.some(Boolean) ? options.fn(this) : options.inverse(this);
  });

  // Logical AND
  hbs.registerHelper('and', function (...args) {
    const options = args.pop(); // last argument is the Handlebars options object
    return args.every(Boolean) ? options.fn(this) : options.inverse(this);
  });
}
