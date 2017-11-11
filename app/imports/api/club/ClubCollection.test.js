import { Clubs } from '/imports/api/club/ClubCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ClubCollection', function testSuite() {
    const name = 'Software Engineering';
    const description = 'Tools and techniques for team-based development of high quality software systems';
    const defineObject = { name, description };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Clubs.define(defineObject);
      expect(Clubs.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Clubs.findDoc(docID);
      expect(doc.name).to.equal(name);
      expect(doc.description).to.equal(description);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Clubs.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Interest.
      const dumpObject = Clubs.dumpOne(docID);
      Clubs.removeIt(docID);
      expect(Clubs.isDefined(docID)).to.be.false;
      docID = Clubs.restoreOne(dumpObject);
      expect(Clubs.isDefined(docID)).to.be.true;
      Clubs.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Clubs.define(defineObject);
      expect(Clubs.isDefined(docID)).to.be.true;
      const docID2 = Clubs.findID(name);
      expect(docID).to.equal(docID2);
      Clubs.findIDs([name, name]);
      Clubs.removeIt(docID);
    });
  });
}

