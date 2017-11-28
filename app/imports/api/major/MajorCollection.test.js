import { Majors } from '/imports/api/major/MajorCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MajorCollection', function testSuite() {
    const name = 'Software Engineering';
    const url = 'SE';
    const description = 'Tools and techniques for team-based development of high quality software systems';
    const defineObject = { name, url, description };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Majors.define(defineObject);
      expect(Majors.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Majors.findDoc(docID);
      expect(doc.name).to.equal(name);
      expect(doc.description).to.equal(description);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Majors.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Interest.
      const dumpObject = Majors.dumpOne(docID);
      Majors.removeIt(docID);
      expect(Majors.isDefined(docID)).to.be.false;
      docID = Majors.restoreOne(dumpObject);
      expect(Majors.isDefined(docID)).to.be.true;
      Majors.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Majors.define(defineObject);
      expect(Majors.isDefined(docID)).to.be.true;
      const docID2 = Majors.findID(name);
      expect(docID).to.equal(docID2);
      Majors.findIDs([name, name]);
      Majors.removeIt(docID);
    });
  });
}

