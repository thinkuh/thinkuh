import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Courses } from '/imports/api/course/CourseCollection';
import { Majors } from '/imports/api/major/MajorCollection';

Template.Forum_Page.onCreated(function onCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Majors.getPublicationName());
});

Template.Forum_Page.helpers({
  getForumId() {
    let item = Majors._collection.findOne({
      url: FlowRouter.getParam('major'),
    });
    if (FlowRouter.getParam('course')) {
      item = Courses._collection.findOne({
        url: FlowRouter.getParam('course'), major: FlowRouter.getParam('major'),
      });
    }
    //console.log('getForumId: course: ' + JSON.stringify(course));
    if (!item) { return null; }
    return item.forumId;
  },
});