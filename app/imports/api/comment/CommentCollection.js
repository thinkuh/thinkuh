import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Comment */

/**
 * Represents a specific interest, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class CommentCollection extends BaseCollection {

  /**
   * Creates the Comment collection.
   */
  constructor() {
    super('Comment', new SimpleSchema({
      author: { type: String },
      dateCreated: { type: Date },
      content: { type: String },
      replies: { type: Array },
      'replies.$': { type: String },
      upvotingUsers: { type: Array },
      'upvotingUsers.$': { type: String },
      dateUpdated: { type: Date, optional: true },
      parentForum: { type: String, optional: true },
      parentComment: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Comment.
   * @example
   * Comments.define({ name: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the interest definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ author, dateCreated, content, replies, upvotingUsers }) {
    check(author, String);
    check(dateCreated, Date);
    check(content, String);
    check(replies, [String]);
    check(upvotingUsers, [String]);
    return this._collection.insert({ author, dateCreated, content, replies, upvotingUsers });
  }

  defineWithParent({ author, dateCreated, content, replies, upvotingUsers, parentComment }) {
    check(author, String);
    check(dateCreated, Date);
    check(content, String);
    check(replies, [String]);
    check(parentComment, String);
    check(upvotingUsers, [String]);
    return this._collection.insert({ author, dateCreated, content, replies, upvotingUsers, parentComment });
  }

  defineTopLevel({ author, dateCreated, content, replies, upvotingUsers, parentForum }) {
    check(author, String);
    check(dateCreated, Date);
    check(content, String);
    check(replies, [String]);
    check(parentForum, String);
    check(upvotingUsers, [String]);
    return this._collection.insert({ author, dateCreated, content, replies, upvotingUsers, parentForum });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Comments = new CommentCollection();
