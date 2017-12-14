import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Courses } from '/imports/api/course/CourseCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Class_Page.onCreated(function onCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Majors.getPublicationName());
  this.state = new ReactiveDict();
});

Template.Class_Page.helpers({
  routeMajorName() {
    return FlowRouter.getParam('major');
  },
  courses() {
    const allCourses = Courses.findAll();
    const major = FlowRouter.getParam('major');
    return _.filter(allCourses, function (course) {
      return course.major == major;
    });
  },
});
