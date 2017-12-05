import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Forum */

/**
 * Represents a specific interest, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class ForumCollection extends BaseCollection {

  /**
   * Creates the Forum collection.
   */
  constructor() {
    super('Forum', new SimpleSchema({
      comments: { type: Array },
      'comments.$': { type: String },
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
  define({ comments }) {
    check(comments, [String]);
    return this._collection.insert({ comments });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Forums = new ForumCollection();
