import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Departments } from '/imports/api/department/DepartmentCollection';
import { Majors } from '/imports/api/major/MajorCollection';
/*import { FlowRouter } from 'meteor/kadira:flow-router';*/

Template.User_Header.onCreated(function onCreated() {
  this.subscribe(Departments.getPublicationName());
  this.subscribe(Majors.getPublicationName());
});

Template.User_Header.helpers({
  routeUserName() {
    return Meteor.user().profile.name;
  },
  isUser() {
    return Meteor.user();
  },
  departments() {
    return Departments.find({}, { sort: { name: 1 } });
  },
  majors() {
    return Majors.find({}, { sort: { name: 1 } });
  },
  findMajor(dmajor) {
    return Majors._collection.findOne({ name: dmajor });
  }
});

