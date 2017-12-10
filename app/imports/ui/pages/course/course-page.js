import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Courses } from '/imports/api/course/CourseCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Course_Page.onCreated(function onCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Majors.getPublicationName());
  this.state = new ReactiveDict();

  this.state.set('major', Majors._collection.findOne({ url: FlowRouter.getParam('major') }));
  this.state.set('course', Courses._collection.findOne({ url: FlowRouter.getParam('course'), major: FlowRouter.getParam('major') }));
});

Template.Course_Page.helpers({
  routeMajorName() {
    return FlowRouter.getParam('major');
  },
  routeCourseName() {
    return FlowRouter.getParam('course');
  },
  course() {
    return Courses._collection.findOne({ url: FlowRouter.getParam('course'), major: FlowRouter.getParam('major') });
  },
  major() {
    return Majors._collection.findOne({ url: FlowRouter.getParam('major') });
  },
  getForumId() {
    const course = Courses._collection.findOne({
      url: FlowRouter.getParam('course'),
    });
    //console.log('getForumId: course: ' + JSON.stringify(course));
    if (!course) { return null; }
    return course.forumId;
  },
});
