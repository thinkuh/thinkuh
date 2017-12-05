import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Majors } from '/imports/api/major/MajorCollection';

Template.Major_Page.onCreated(function onCreated() {
  this.subscribe(Majors.getPublicationName());
});

Template.Major_Page.helpers({
  routeUserName() {
    return Meteor.user().profile.name;
  },
  routeMajorName() {
    return FlowRouter.getParam('major');
  },
  majors() {
    return Majors.find({}, { sort: { name: 1 } });
  },
});