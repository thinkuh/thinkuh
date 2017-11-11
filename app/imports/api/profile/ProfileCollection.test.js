/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('ProfileCollection', function testSuite() {
    const username = 'johnson';
    const firstName = 'Philip';
    const lastName = 'Johnson';
    const picture = 'http://philipmjohnson.org/headshot.jpg';
    const standing = 'Professor Computer Science';
    const majorName = 'Software Engineering';
    const majorDescription = 'Tools for software development';
    const majors = [majorName];
    const clubName = 'Software Engineering';
    const clubDescription = 'Tools for software development';
    const clubs = [clubName];
    const about = 'I have been a professor of computer science at UH since 1990.';
    const defineObject = {
      username,
      firstName,
      lastName,
      picture,
      standing,
      majors,
      clubs,
      about,
    };

    before(function setup() {
      removeAllEntities();
      // Define a sample interest.
      Majors.define({ name: majorName, description: majorDescription });
    });

    before(function setup() {
      removeAllEntities();
      // Define a sample interest.
      Clubs.define({ name: clubName, description: clubDescription });
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Profiles.define(defineObject);
      expect(Profiles.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Profiles.findDoc(docID);
      expect(doc.username).to.equal(username);
      expect(doc.firstName).to.equal(firstName);
      expect(doc.lastName).to.equal(lastName);
      expect(doc.picture).to.equal(picture);
      expect(doc.standing).to.equal(standing);
      expect(doc.majors[0]).to.equal(majorName);
      expect(doc.clubs[0]).to.equal(clubName);
      expect(doc.about).to.equal(about);
      // Check that multiple definitions with the same email address fail
      expect(function foo() {
        Profiles.define(defineObject);
      }).to.throw(Error);
      // Check that we can dump and restore a Profile.
      const dumpObject = Profiles.dumpOne(docID);
      Profiles.removeIt(docID);
      expect(Profiles.isDefined(docID)).to.be.false;
      docID = Profiles.restoreOne(dumpObject);
      expect(Profiles.isDefined(docID)).to.be.true;
      Profiles.removeIt(docID);
    });

    it('#define (illegal majors)', function test() {
      const illegalMajors = ['foo'];
      const defineObject2 = {
        username, firstName, lastName, picture, standing, majors: illegalMajors, clubs, about,
      };
      expect(function foo() {
        Profiles.define(defineObject2);
      }).to.throw(Error);
    });

    it('#define (duplicate majors)', function test() {
      const duplicateMajors = [clubName, clubName];
      const defineObject3 = {
        username, firstName, lastName, picture, standing, majors: duplicateMajors, clubs, about,
      };
      expect(function foo() {
        Profiles.define(defineObject3);
      }).to.throw(Error);
    });

    it('#define (illegal clubs)', function test() {
      const illegalClubs = ['foo'];
      const defineObject4 = {
        username, firstName, lastName, picture, standing, majors, clubs: illegalClubs, about,
      };
      expect(function foo() {
        Profiles.define(defineObject4);
      }).to.throw(Error);
    });

    it('#define (duplicate clubs)', function test() {
      const duplicateClubs = [clubName, clubName];
      const defineObject5 = {
        username, firstName, lastName, picture, standing, majors, clubs: duplicateClubs, about,
      };
      expect(function foo() {
        Profiles.define(defineObject5);
      }).to.throw(Error);
    });
  });
}

