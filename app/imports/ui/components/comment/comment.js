import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Forums } from '/imports/api/forum/ForumCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Parser, HtmlRenderer } from 'commonmark';

Template.Comment.onCreated(function onCreated() {
  this.subscribe(Forums.getPublicationName());
  this.subscribe(Comments.getPublicationName());
  this.subscribe(Profiles.getPublicationName());

  this.context = Comments.getSchema().namedContext('Comment');
  this.markdownParser = new Parser();
  this.markdownRenderer = new HtmlRenderer({ safe: true });
  this.state = new ReactiveDict();
  this.state.set('comment', null);
  this.state.set('commentProfile', null);
  this.state.set('isReplying', false);
  this.state.set('idEditing', false);
  this.state.set('isRepliesOpen', false);

  this.isLoggedIn = function isLoggedIn() {
    return !!Meteor.user();
  };
  this.isAuthorOfComment = function isAuthorOfComment(comment) {
    if (!comment) { return false; }
    const result = comment.author === Meteor.user().profile.name;
    return !!result;
  };
});

Template.Comment.onRendered({
});

Template.Comment.events({
  'click .js-comment-toggle-replies-button'(event, instance) {
    event.preventDefault();
    event.stopPropagation();
    instance.state.set('isRepliesOpen', !instance.state.get('isRepliesOpen'));
    //console.log(`isRepliesOpen: ${instance.state.get('isRepliesOpen')}`);
    return false;
  },

  'click .js-comment-reply-button'(event, instance) {
    event.preventDefault();
    event.stopPropagation();
    instance.state.set('isReplying', !instance.state.get('isReplying'));
    //console.log(`isReplying: ${instance.state.get('isReplying')}`);
    return false;
  },

  'click .js-comment-edit-button'(event, instance) {
    event.preventDefault();
    event.stopPropagation();
    instance.state.set('isEditing', !instance.state.get('isEditing'));
    //console.log(`isEditing: ${instance.state.get('isEditing')}`);
    return false;
  },

  'click .js-comment-delete-button'(event, instance) {
    event.preventDefault();
    event.stopPropagation();
    if (instance.isAuthorOfComment(instance.state.get('comment'))) {
      Comments._collection.remove(instance.state.get('comment')._id);
      instance.state.set('comment', null);
      instance.state.set('commentProfile', null);
      console.log('Deleted comment?');
    } else {
      console.error('Cannot delete comment without access!');
    }
    return false;
  },

  'submit .js-comment-reply-textbox'(event, instance) {
    event.stopPropagation();
    event.preventDefault();

    let author = null;
    if (instance.isLoggedIn()) {
      author = Meteor.user().profile.name;
    }
    const content = event.target['text-editor-textarea'].value;
    const dateCreated = new Date();
    const replies = [];
    const parentComment = instance.state.get('comment')._id;

    const newCommentData = {
      author, dateCreated, content, replies, parentComment,
    };

    //console.log(event);
    //console.log(instance);
    //console.log(newCommentData);

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Comments.getSchema().clean(newCommentData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      //console.log('IS VALID');
      const id = Comments.define(cleanData);
      let updatedComment = instance.state.get('comment');
      //console.log(`updatedComment: ${JSON.stringify(updatedComment)}`);
      updatedComment.replies.push(id); //console.log(`updatedComment.replies: ${updatedComment.replies}`);
      Comments.update(instance.state.get('comment')._id, {
        $set: { replies: updatedComment.replies },
      });
      instance.state.set('comment', updatedComment);
      //console.log(`updatedComment: ${JSON.stringify(updatedComment)}`);
      //console.log(id);
      instance.state.set('isRepliesOpen', true);
      instance.state.set('isReplying', false);
      event.target.reset();
      return true;
    }
    console.log('NOT VALID');
    const invalidKeys = instance.context.validationErrors();
    console.log(invalidKeys);
    return false;
  },

  'submit .js-comment-edit-textbox'(event, instance) {
    event.stopPropagation();
    event.preventDefault();

    let author = null;
    const subjectComment = instance.state.get('comment');
    if (instance.isLoggedIn()) {
      author = Meteor.user().profile.name;
    }
    const content = event.target['text-editor-textarea'].value;
    const dateUpdated = new Date();

    const parentComment = subjectComment._id;
    const dateCreated = subjectComment.dateCreated;
    const replies = subjectComment.replies;

    const newCommentData = {
      author, dateCreated, content, replies, parentComment, dateUpdated,
    };

    //console.log(event);
    //console.log(instance);
    //console.log(newCommentData);

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Comments.getSchema().clean(newCommentData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      console.log('IS VALID');
      const id = Comments.define(cleanData);
      let updatedComment = instance.state.get('comment');
      //console.log(`updatedComment: ${JSON.stringify(updatedComment)}`);
      Comments.update(instance.state.get('comment')._id, {
        $set: newCommentData,
      });
      instance.state.set('comment', updatedComment);
      //console.log(`updatedComment: ${JSON.stringify(updatedComment)}`);
      //console.log(id);
      instance.state.set('isEditing', false);
      event.target.reset();
      return true;
    }
    console.log('NOT VALID');
    const invalidKeys = instance.context.validationErrors();
    console.log(invalidKeys);
    return false;
  },

});

Template.Comment.helpers({
  helloWorld: function helloWorld() {
    return 'Hello world';
  },

  getComment: function getComment(id) {
    //console.log(Template.currentData());
    //console.log(id);
    //console.log(`getcomment: ${id}`);
    const comment = Comments._collection.findOne(id);
    Template.instance().state.set('comment', comment);
    //console.log(Template.instance().state.get('comment'));
    return Template.instance().state.get('comment');
  },

  jsonStringify: function jsonStringify(item) {
    return JSON.stringify(item);
  },

  getCommentProfile: function getCommentProfile(author) {
    //console.log(`getCommentProfile: ${author}`);
    const hello = Profiles._collection.find({}).fetch();
    // const hello = Profiles._collection.findOne({ username: author });
    //console.log(`hello: ${hello}`);
    const profile = Profiles.findDoc({ username: author });
    Template.instance().state.set('commentProfile', profile);
    //console.log(`getCommentProfile item: ${Template.instance().state.get('commentProfile')}`);
    return Template.instance().state.get('commentProfile');
  },

  renderMarkdown: function renderMarkdown(text) {
    const parsed = Template.instance().markdownParser.parse(text);
    return Template.instance().markdownRenderer.render(parsed);
  },

  getProfilePicture: function getProfilePicture(url) {
    //console.log(`getProfilePicture: ${url}`);
    if (!url) {
      return 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
    }
    return url;
  },

  isReplying: function isReplying() {
    return Template.instance().state.get('isReplying');
  },

  isEditing: function isEditing() {
    return Template.instance().state.get('isEditing');
  },

  isLoggedIn: function isLoggedIn() {
    return this.isLoggedIn();
  },

  isRepliesOpen: function isRepliesOpen() {
    return Template.instance().state.get('isRepliesOpen');
  },

  anyValidReplies: function anyValidReplies(array) {
    if (!array) { return false; }
    return array.length > 0;
  },

  isAuthorOfComment: function isAuthorOfComment(comment) {
    return Template.instance().isAuthorOfComment(comment);
  },

  replyCount: function replyCount(replies) {
    return replies.length;
  },
});
