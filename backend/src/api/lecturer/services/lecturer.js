'use strict';

/**
 * lecturer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lecturer.lecturer');
