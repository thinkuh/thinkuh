import { Meteor } from 'meteor/meteor';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Departments } from '/imports/api/department/DepartmentCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Forums } from '/imports/api/forum/ForumCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { _ } from 'meteor/underscore';

/* global Assets */

/* eslint-disable no-console */

/**
 * Returns the definition array associated with collectionName in the restoreJSON structure.
 * @param restoreJSON The restore file contents.
 * @param collection The collection of interest.
 */
function getDefinitions(restoreJSON, collection) {
  return _.find(restoreJSON.collections, obj => obj.name === collection).contents;
}

/**
 * Given a collection and the restoreJSON structure, looks up the definitions and invokes define() on them.
 * @param collection The collection to be restored.
 * @param restoreJSON The structure containing all of the definitions.
 */
function restoreCollection(collection, restoreJSON) {
  const definitions = getDefinitions(restoreJSON, collection._collectionName);
  console.log(`Defining ${definitions.length} ${collection._collectionName} documents.`);
  _.each(definitions, definition => collection.define(definition));
}

Meteor.startup(() => {
  /** Only initialize database if it's empty. */
  const collectionList = [Clubs, Majors, Departments, Profiles];
  const totalDocuments = _.reduce(collectionList, function reducer(memo, collection) {
    return memo + collection.count();
  }, 0);
  if (totalDocuments === 0) {
    const fileName = Meteor.settings.public.initialDatabaseFileName;

    console.log(`Restoring database from file ${fileName}.`);
    const restoreJSON = JSON.parse(Assets.getText(fileName));
    _.each(collectionList, collection => {
      restoreCollection(collection, restoreJSON);
    });
    const commentId = Comments.define({
      author: 'altenber',
      dateCreated: new Date(),
      content: 'Hello! Welcome to the Comment test!',
      replies: [],
      parentForum: 'placeholder',
    });
    console.log(`commentId: ${commentId}`);
    const forumId = Forums._collection.update(
      { _id: 0 },
      {
        $set: {
          _id: 0,
          comments: [commentId],
        },
      },
      { upsert: true },
    );
    Comments._collection.update(
      { _id: commentId },
      {
        $set: {
          parentForum: forumId,
        },
      },
    );
    // Put the pre-created dummy forum's ID into a Meteor.method.
    Meteor.methods({
      getDummyForumId: function getDummyForum() {
        return forumId;
      },
    });
  }
});
