import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Profile */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class ProfileCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Profile', new SimpleSchema({
      username: { type: String },
      // Remainder are optional
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      standing: { type: String, optional: true },
      majors: { type: Array, optional: true },
      'majors.$': { type: String },
      clubs: { type: Array, optional: true },
      'clubs.$': { type: String },
      about: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Profile.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   interests: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({
           username, firstName = '', lastName = '', picture = '', standing='', majors = [], clubs = [], about = '',
         }) {
    // make sure required fields are OK.
    const checkPattern = {
      username: String, firstName: String, lastName: String, picture: String, standing: String, about: String,
    };
    check({ username, firstName, lastName, picture, standing, about }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    // Throw an error if any of the passed Major names are not defined.
    Clubs.assertNames(clubs);

    // Throw an error if there are duplicates in the passed major names.
    if (clubs.length !== _.uniq(clubs).length) {
      throw new Meteor.Error(`${clubs} contains duplicates`);
    }

    // Throw an error if any of the passed Major names are not defined.
    Majors.assertNames(majors);

    // Throw an error if there are duplicates in the passed major names.
    if (majors.length !== _.uniq(majors).length) {
      throw new Meteor.Error(`${majors} contains duplicates`);
    }

    return this._collection.insert({
      username, firstName, lastName, picture, standing, majors, clubs, about,
    });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const picture = doc.picture;
    const standing = doc.standing;
    const majors = doc.majors;
    const clubs = doc.clubs;
    const about = doc.about;
    return { username, firstName, lastName, picture, standing, majors, clubs, about, };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Profiles = new ProfileCollection();
