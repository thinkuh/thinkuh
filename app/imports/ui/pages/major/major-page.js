import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Major_Page.helpers({
  routeUserName() {
    return Meteor.user().profile.name;
  },
  routeMajorName() {
    return FlowRouter.getParam('major');
  },
});