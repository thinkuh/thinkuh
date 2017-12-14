import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Majors } from '/imports/api/major/MajorCollection';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Major_Page.onCreated(function onCreated() {
  this.subscribe(Majors.getPublicationName());
  this.state = new ReactiveDict();

  this.state.set('major', Majors._collection.findOne({ url: FlowRouter.getParam('major') }));
});

Template.Major_Page.helpers({
  routeUserName() {
    return Meteor.user().profile.name;
  },
  routeMajorName() {
    return FlowRouter.getParam('major');
  },
  major() {
    return Majors._collection.findOne({
      url: FlowRouter.getParam('major'),
    });
  },
  getForumId() {
    const major = Majors._collection.findOne({
      url: FlowRouter.getParam('major'),
    });
    console.log('getForumId: major: ' + JSON.stringify(major));
    if (!major) { return null; }
    return major.forumId;
  },
});
