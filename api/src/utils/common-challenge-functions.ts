import { omit, pick } from 'lodash';
import { user } from '@prisma/client';
import { FastifyInstance } from 'fastify';
// import { SavedChallenge } from '../../../client/src/redux/prop-types';
import { getChallenges } from './get-challenges';

const jsCertProjectIds = [
  'aaa48de84e1ecc7c742e1124',
  'a7f4d8f2483413a6ce226cac',
  '56533eb9ac21ba0edf2244e2',
  'aff0395860f5d3034dc0bfc9',
  'aa2e6f85cab2ab736c9a9b24'
];

const multifileCertProjectIds = getChallenges()
  .filter(challenge => challenge.challengeType === 14)
  .map(challenge => challenge.id);

const savableChallenges = getChallenges()
  .filter(challenge => challenge.challengeType === 14)
  .map(challenge => challenge.id);

type SavedChallengeFile = {
  key: string;
  ext: string; // NOTE: This is Ext type in client
  name: string;
  history?: string[];
  contents: string;
};

type SavedChallenge = {
  id: string;
  lastSavedDate: number;
  files?: SavedChallengeFile[];
};

// TODO: Confirm this type - read comments below
type CompletedChallengeFile = {
  key: string;
  ext: string; // NOTE: This is Ext type in client
  name: string;
  contents: string;

  // These values are present in prop-types and ajax.ts builds with it
  // editableRegionBoundaries?: number[];
  // usesMultifileEditor?: boolean;
  // error: null | string | unknown;
  // head: string;
  // tail: string;
  // seed: string;
  // id: string;
  // history: string[];

  // This value is present in prisma schema
  path?: string | null;
};

type CompletedChallenge = {
  id: string;
  solution?: string | null;
  githubLink?: string | null;
  challengeType?: number | null;
  completedDate: number;
  isManuallyApproved?: boolean | null;
  files?: CompletedChallengeFile[];
};

export async function buildUserUpdate(
  fastify: FastifyInstance,
  user: user,
  challengeId: string,
  _completedChallenge: CompletedChallenge,
  timezone?: string // TODO: is this required as its not given as a arg anywhere
) {
  const { files, completedDate: newProgressTimeStamp = Date.now() } =
    _completedChallenge;
  let completedChallenge: CompletedChallenge;

  if (
    jsCertProjectIds.includes(challengeId) ||
    multifileCertProjectIds.includes(challengeId)
  ) {
    completedChallenge = {
      ..._completedChallenge,
      files: files?.map(
        file =>
          pick(file, [
            'contents',
            'key',
            'index',
            'name',
            'path',
            'ext'
          ]) as CompletedChallengeFile
      )
    };
  } else {
    completedChallenge = omit(_completedChallenge, ['files']);
  }
  let finalChallenge = {} as CompletedChallenge;

  // Since these values are destuctured for easier updating, collectively update before returning
  const {
    timezone: userTimezone,
    completedChallenges = [],
    needsModeration = false,
    savedChallenges = [],
    progressTimestamps = [],
    partiallyCompletedChallenges = []
  } = user;

  const userCompletedChallenges: CompletedChallenge[] = completedChallenges;
  const userSavedChallenges: SavedChallenge[] = savedChallenges;
  const userProgressTimestamps = progressTimestamps;
  const userPartiallyCompletedChallenges = partiallyCompletedChallenges;

  const oldIndex = userCompletedChallenges.findIndex(
    ({ id }) => challengeId === id
  );

  const alreadyCompleted = oldIndex !== -1;
  const oldChallenge = alreadyCompleted
    ? userCompletedChallenges[oldIndex]
    : null;

  if (alreadyCompleted && oldChallenge) {
    const challengeWithOldDate = userCompletedChallenges[oldIndex];

    if (challengeWithOldDate) {
      challengeWithOldDate.completedDate = oldChallenge.completedDate;
      finalChallenge = {
        ...completedChallenge,
        ...challengeWithOldDate
      };
    }
  } else {
    finalChallenge = {
      ...completedChallenge
    };
    if (userProgressTimestamps && Array.isArray(userProgressTimestamps)) {
      userProgressTimestamps.push(newProgressTimeStamp);
    }
    userCompletedChallenges.push(finalChallenge);
  }

  if (savableChallenges.includes(challengeId)) {
    const challengeToSave: SavedChallenge = {
      id: challengeId,
      lastSavedDate: newProgressTimeStamp,
      files: files?.map(file =>
        pick(file, ['contents', 'key', 'name', 'ext', 'history'])
      )
    };

    const savedIndex = userSavedChallenges.findIndex(
      ({ id }) => challengeId === id
    );

    if (savedIndex >= 0) {
      userSavedChallenges[savedIndex] = challengeToSave;
    } else {
      userSavedChallenges.push(challengeToSave);
    }
  }

  // remove from partiallyCompleted on submit
  const updatedPartiallyCompletedChallenges =
    userPartiallyCompletedChallenges.filter(
      challenge => challenge.id !== challengeId
    );

  if (
    timezone &&
    timezone !== 'UTC' &&
    !userTimezone &&
    userTimezone === 'UTC'
  ) {
    timezone = userTimezone;
    await fastify.prisma.user.update({
      where: { id: user.id },
      data: {
        timezone
      }
    });
  }

  // Doesnt make sense as if false it wont be executed and when true sets "true" again
  // if (needsModeration) {
  //     await fastify.prisma.user.update({
  //         where: { id: user.id },
  //         data: {
  //             needsModeration: true
  //         }
  //     });
  // }

  await fastify.prisma.user.update({
    where: { id: user.id },
    data: {
      completedChallenges: userCompletedChallenges,
      needsModeration,
      savedChallenges: userSavedChallenges,
      progressTimestamps: userProgressTimestamps,
      partiallyCompletedChallenges: updatedPartiallyCompletedChallenges
    }
  });

  const updateData = {};

  return {
    alreadyCompleted,
    updateData, // Might need to remove this variable as we're updating user object in this function now instead of in the endpoint handler
    completedDate: finalChallenge.completedDate,
    userSavedChallenges
  };
}
