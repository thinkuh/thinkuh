import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Courses } from '/imports/api/course/CourseCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ClassTips } from '/imports/api/class-tip/ClassTipCollection';
import { Parser, HtmlRenderer } from 'commonmark';

Template.Course_Page.onCreated(function onCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Majors.getPublicationName());
  this.subscribe(ClassTips.getPublicationName());

  // Create the validation context
  this.classTipsContext = ClassTips.getSchema().namedContext('Course_Page');
  // Create the Markdown parser and renderer for the ClassTips this.markdownParser = new Parser();
  this.markdownRenderer = new HtmlRenderer({ safe: true });

  // Cache the major and course locally
  this.state = new ReactiveDict();
  this.state.set('major', Majors._collection.findOne({ url: FlowRouter.getParam('major') }));
  this.state.set('course', Courses._collection.findOne({ url: FlowRouter.getParam('course'), major: FlowRouter.getParam('major') }));
});

Template.Course_Page.events({

  'submit .js-class-tip-textbox-create-tip-button'(event, instance) {
    // Stop reloading the page, and isolate the event to the template
    event.preventDefault();
    event.stopPropagation();

    console.log(event);
    console.log(instance);

    // Gather the required content for the ClassTip to be inserted into the current Course
    const name = event.target['class-tip-textbox-name'].value;
    const description = event.target['class-tip-textbox-description'].value;
    const icon = event.target['class-tip-icon'].value;
    const author = Meteor.user().profile.name;
    const upvotingUsers = [author];
    const parentCourse = Courses._collection.findOne({
      url: FlowRouter.getParam('course'),
      major: FlowRouter.getParam('major'),
    })._id;

    const newClassTipData = {
      name, description, icon, author, upvotingUsers, parentCourse
    };
    console.log(newClassTipData);

    instance.classTipsContext.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = ClassTips.getSchema().clean(newClassTipData);
    // Determine validity.
    instance.classTipsContext.validate(cleanData);

    if (instance.classTipsContext.isValid()) {
      console.log('VALID CLASSTIP');
      // If valid, first update the collection item
      const course = Courses._collection.findOne({
        url: FlowRouter.getParam('course'),
        major: FlowRouter.getParam('major'),
      });

      const classTipId = ClassTips.define(cleanData);
      course.classTips.push(classTipId);
      console.log(course);

      Courses.update(course._id, {
        $set: { classTips: course.classTips },
      });
      // Then, update the local cached item
      instance.state.set('course', course);
      console.log('successful insert');
    } else {
      console.log('INVALID CLASSTIP');
      // Print out the validation errors
      const invalidKeys = instance.classTipsContext.validationErrors();
      console.log(invalidKeys);
    }
    return false;
  },
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
      url: FlowRouter.getParam('course'), major: FlowRouter.getParam('major'),
    });
    // console.log('getForumId: course: ' + JSON.stringify(course));
    if (!course) { return null; }
    return course.forumId;
  },
  getClassTips() {
    const course = Courses._collection.findOne({
      url: FlowRouter.getParam('course'),
      major: FlowRouter.getParam('major'),
    });
    console.log('getClassTips:');
    console.log(course);
    if (course) {
      return course.classTips;
    }
    return null;
  },
});
