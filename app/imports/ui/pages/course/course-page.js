import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Courses } from '/imports/api/course/CourseCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Course_Page.onCreated(function onCreated() {
  this.subscribe(Courses.getPublicationName());
  this.state = new ReactiveDict();

  this.state.set('major', Majors._collection.findOne({ url: FlowRouter.getParam('major') }));
  this.state.set('course', Courses._collection.findOne({ url: FlowRouter.getParam('course') }));
});

Template.Major_Page.helpers({
  routeUserName() {
    return Meteor.user().profile.name;
  },
  majors() {
    return Majors.find({}, { sort: { name: 1 } });
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
