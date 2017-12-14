import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ClassTips } from '/imports/api/class-tip/ClassTipCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { Parser, HtmlRenderer } from 'commonmark';

Template.Class_Tip.onCreated(function onCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(ClassTips.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  console.log(`ClassTips.getPublicationName: ${ClassTips.getPublicationName()}`);

  this.state = new ReactiveDict();
  this.state.set('classTip', null);
  this.state.set('isEditing', false);

  // Create the validation context
  this.classTipsContext = ClassTips.getSchema().namedContext('Class_Tip');
  // Create the Markdown parser and renderer for the ClassTips this.markdownParser = new Parser();
  this.markdownRenderer = new HtmlRenderer({ safe: true });

  this.getClassTip = function getClassTip(id) {
    if (!id) { return null; }
    const classTip = ClassTips._collection.findOne({ _id: id });
    console.log(`getClassTip: ${JSON.stringify(classTip)}`);
    this.state.set('classTip', classTip);
    return classTip;
  };
});

Template.Class_Tip.onRendered(function () {
  console.log('Class_Tip: Hey there!');
});

Template.Class_Tip.events({
  'click .class-tip-upvote'(event, instance) {
    event.preventDefault();
    event.stopPropagation();

    const classTip = Template.instance().state.get('classTip');
    const username = Meteor.user().profile.name;
    if (classTip.upvotingUsers.includes(username)) {
      const index = classTip.upvotingUsers.indexOf(username);
      if (index > -1) {
        classTip.upvotingUsers.splice(index, 1);
      }
      ClassTips.update(instance.state.get('classTip')._id, {
        $set: { upvotingUsers: classTip.upvotingUsers },
      });
      console.log('unvote');
    } else {
      classTip.upvotingUsers.push(username);
      ClassTips.update(instance.state.get('classTip')._id, {
        $set: { upvotingUsers: classTip.upvotingUsers },
      });
      console.log('vote');
    }
    instance.state.set('classTip', ClassTips.findDoc(classTip._id));
    return false;
  },

  'click .class-tip-edit'(event, instance) {
    event.preventDefault();
    event.stopPropagation();

    instance.state.set('isEditing', !Template.instance().state.get('isEditing'));

    console.log('edit');
  },

  'submit .js-class-tip-textbox-edit-tip-button'(event, instance) {
    event.preventDefault();
    event.stopPropagation();

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
      name, description, icon, author, upvotingUsers, parentCourse,
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
      ClassTips.update(instance.state.get('classTip')._id, {
        $set: cleanData,
      });
      // Then, update the local cached item
      instance.state.set('classTip', classTip);
      console.log('successful insert');
    } else {
      console.log('INVALID CLASSTIP');
      // Print out the validation errors
      const invalidKeys = instance.classTipsContext.validationErrors();
      console.log(invalidKeys);
    }
    console.log('Finished edit.');
    return false;
  },

  'click .class-tip-delete'(event, instance) {
    event.preventDefault();
    event.stopPropagation();

    if (Meteor.user().profile.name === Template.instance().state.get('classTip').author) {
      const classTip = instance.state.get('classTip');

      const course = Courses.findDoc(classTip.parentCourse);

      course.classTips.splice(classTip._id);

      Courses.update(classTip._id, {
        $set: { classTips: course.classTips },
      });
      ClassTips._collection.remove({ _id: classTip._id });

      instance.state.set('classTip', null);
      console.log('delete');
    }
  },
});

Template.Class_Tip.helpers({
  getClassTip(id) {
    return Template.instance().getClassTip(id);
  },

  isLoggedIn(id) {
    return Meteor.user().profile.name === id;
  },

  isEditing() {
    return Template.instance().state.get('isEditing');
  },

  hasUpvoted() {
    const result = Template.instance().state.get('classTip').upvotingUsers.includes(Meteor.user().profile.name);
    console.log(`hasUpvoted: ${result}`);
    return result;
  },

  getUpvotes() {
    const result = Template.instance().state.get('classTip').upvotingUsers.length;
    console.log(`getUpvotes: ${result}`);
    return result;
  },

  getCommentProfile: function getCommentProfile(author) {
    // console.log(`getCommentProfile: ${author}`);
    const profile = Profiles.findDoc({ username: author });
    // console.log(`getCommentProfile item: ${Template.instance().state.get('commentProfile')}`);
    return profile;
  },
});

