/*
 * SPDX-FileCopyrightText: 2022 Helmholtz-Zentrum für Infektionsforschung GmbH (HZI) <PiaPost@helmholtz-hzi.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import fetch from '../utils/fetch.util';
import chalk from 'chalk';

import {
  Answers,
  Questionnaire,
  QuestionnaireInstance,
} from '../models/questionnaire.model';
import { AuthToken } from '../models/user.model';
import assert from 'assert';

export class QuestionnaireClient {
  constructor(
    private readonly baseUrl: string,
    private readonly adminBaseUrl: string
  ) {}

  async createQuestionnaire(
    questionnaire: Questionnaire,
    forscherToken: AuthToken
  ): Promise<string> {
    const response = await fetch(
      this.adminBaseUrl + '/questionnaire/questionnaires',
      {
        method: 'post',
        body: JSON.stringify(questionnaire),
        headers: {
          Authorization: forscherToken,
          'Content-Type': 'application/json',
        },
      }
    );
    const body = await response?.json();
    console.log(
      chalk.blue('QuestionnaireClient: created questionnaire: ' + body.name)
    );
    return body.name;
  }

  async getQuestionnaireInstancesForProband(
    probandToken: AuthToken
  ): Promise<QuestionnaireInstance[]> {
    const response = await fetch(
      this.baseUrl + '/questionnaire/questionnaireInstances',
      {
        method: 'get',
        headers: {
          Authorization: probandToken,
        },
      }
    );
    assert(response);
    return (await response.json()).questionnaireInstances;
  }

  async releaseQuestionnaireInstance(
    id: number,
    probandToken: AuthToken
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/questionnaire/questionnaireInstances/${id}`,
      {
        method: 'put',
        body: JSON.stringify({
          status: 'in_progress',
          progress: 80,
          release_version: 1,
        }),
        headers: {
          Authorization: probandToken,
          'Content-Type': 'application/json',
        },
      }
    );
    assert(response);
  }

  async createAnswers(
    questionnaireInstanceId: number,
    answers: Answers,
    probandToken: AuthToken
  ): Promise<void> {
    await fetch(
      this.baseUrl +
        '/questionnaire/questionnaireInstances/' +
        questionnaireInstanceId +
        '/answers',
      {
        method: 'post',
        body: JSON.stringify(answers),
        headers: {
          Authorization: probandToken,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
