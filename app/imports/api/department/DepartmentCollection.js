import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Interest */

/**
 * Represents a specific interest, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class DepartmentCollection extends BaseCollection {

  /**
   * Creates the Interest collection.
   */
  constructor() {
    super('Department', new SimpleSchema({
      name: { type: String },
      majors: { type: Array, optional: true },
      'majors.$': { type: String },
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
  define({ name, majors }) {
    check(name, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Major`);
    }

    // Throw an error if any of the passed Major names are not defined.
    Majors.assertNames(majors);

    // Throw an error if there are duplicates in the passed major names.
    if (majors.length !== _.uniq(majors).length) {
      throw new Meteor.Error(`${majors} contains duplicates`);
    }
    return this._collection.insert({ name, majors });
  }

  /**
   * Returns the Interest name corresponding to the passed interest docID.
   * @param interestID An interest docID.
   * @returns { String } An interest name.
   * @throws { Meteor.Error} If the interest docID cannot be found.
   */
  findName(departmentID) {
    this.assertDefined(departmentID);
    return this.findDoc(departmentID).name;
  }

  /**
   * Returns a list of Interest names corresponding to the passed list of Interest docIDs.
   * @param interestIDs A list of Interest docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(departmentIDs) {
    return departmentIDs.map(departmentID => this.findName(departmentID));
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
    const majors = doc.majors;
    return { name, majors };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Departments = new DepartmentCollection();
