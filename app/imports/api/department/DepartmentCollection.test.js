import { Departments } from '/imports/api/department/DepartmentCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('DepartmentCollection', function testSuite() {
    const name = 'College of Natural Sciences';
    const majorName = 'Information and Computer Sciences';
    const majors = [majorName];
    const defineObject = { name, majors };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Departments.define(defineObject);
      expect(Departments.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Departments.findDoc(docID);
      expect(doc.name).to.equal(name);
      expect(doc.majors[0]).to.equal(majorName);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Departments.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Interest.
      const dumpObject = Departments.dumpOne(docID);
      Departments.removeIt(docID);
      expect(Departments.isDefined(docID)).to.be.false;
      docID = Departments.restoreOne(dumpObject);
      expect(Departments.isDefined(docID)).to.be.true;
      Departments.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Departments.define(defineObject);
      expect(Departments.isDefined(docID)).to.be.true;
      const docID2 = Departments.findID(name);
      expect(docID).to.equal(docID2);
      Departments.findIDs([name, name]);
      Departments.removeIt(docID);
    });
  });
}

