import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Comments } from '/imports/api/comment/CommentCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Comment_Page.onCreated(function onCreated() {
  this.subscribe(Comments.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Comments.getSchema().namedContext('Comment_Page');

  this.isLoggedIn = function isLoggedIn() {
    return !!Meteor.user();
  };
});


Template.Comment_Page.helpers({
  isLoggedIn() {
    return this.isLoggedIn();
  },
  getDummyForumId() {
    return Meteor.call('getDummyForumId');
  },
});


Template.Comment_Page.events({
  'click .the-button'(event, instance) {
    console.log(event);
    console.log(instance);
  },
});
