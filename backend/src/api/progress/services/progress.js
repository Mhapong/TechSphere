'use strict';

/**
 * progress service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::progress.progress');
