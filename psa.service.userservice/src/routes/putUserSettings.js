/*
 * SPDX-FileCopyrightText: 2021 Helmholtz-Zentrum für Infektionsforschung GmbH (HZI) <PiaPost@helmholtz-hzi.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const Joi = require('joi');

const userSettingsHandler = require('../handlers/userSettingsHandler.js');

module.exports = {
  path: '/user/userSettings/{username}',
  method: 'PUT',
  handler: userSettingsHandler.updateOne,
  config: {
    description: 'updates the users settings',
    auth: 'jwt',
    tags: ['api'],
    validate: {
      params: Joi.object({
        username: Joi.string()
          .description('the name of the user')
          .required()
          .default('Testproband1'),
      }).unknown(),
      payload: Joi.object({
        logging_active: Joi.boolean()
          .description('activate or deactivate all logging for this user')
          .required(),
      }).unknown(),
    },
  },
};
