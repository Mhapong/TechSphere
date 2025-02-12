'use strict';

/**
 * confirm-purchase service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::confirm-purchase.confirm-purchase');
