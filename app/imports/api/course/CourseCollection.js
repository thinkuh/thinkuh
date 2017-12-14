import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';
import { Forums } from '/imports/api/forum/ForumCollection';

/** @module Interest */

/**
 * Represents a specific interest, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class CourseCollection extends BaseCollection {

  /**
   * Creates the Interest collection.
   */
  constructor() {
    super('Course', new SimpleSchema({
      name: { type: String },
      major: { type: String },
      url: { type: String, regEx: /^\d{3}[A-Z]?$/ },
      description: { type: String, optional: true },
      forumId: { type: String },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Interest.
   * @example
   * Interests.define({ name: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the interest definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name, major, url, description }) {
    check(name, String);
    check(major, String);
    check(url, String);
    check(description, String);
    const forumId = Forums.define({ comments: [] });
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Major`);
    }
    return this._collection.insert({ name, major, url, description, forumId });
  }

  /**
   * Returns the Interest name corresponding to the passed interest docID.
   * @param interestID An interest docID.
   * @returns { String } An interest name.
   * @throws { Meteor.Error} If the interest docID cannot be found.
   */
  findName(courseID) {
    this.assertDefined(courseID);
    return this.findDoc(courseID).name;
  }

  /**
   * Returns a list of Interest names corresponding to the passed list of Interest docIDs.
   * @param interestIDs A list of Interest docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(courseIDs) {
    return courseIDs.map(courseID => this.findName(courseID));
  }

  /**
   * Throws an error if the passed name is not a defined Interest name.
   * @param name The name of an interest.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all Interest names.
   * @param names An array of (hopefully) Interest names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed Interest name, or throws an error if it cannot be found.
   * @param { String } name An interest name.
   * @returns { String } The docID associated with the name.
   * @throws { Meteor.Error } If name is not associated with an Interest.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of Interest names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of interest names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not an Interest name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Interest docID in a format acceptable to define().
   * @param docID The docID of an Interest.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const major = doc.major;
    const url = doc.url;
    const description = doc.description;
    return { name, major, url, description };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Courses = new CourseCollection();
