import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Forums } from '/imports/api/forum/ForumCollection';
import { Comments } from '/imports/api/comment/CommentCollection';

Template.Forum.onCreated(function onCreated() {
  this.subscribe(Forums.getPublicationName());
  this.subscribe(Comments.getPublicationName());

  this.context = Comments.getSchema().namedContext('Forum');
  this.state = new ReactiveDict();
  this.state.set('forum', null);

  this.isLoggedIn = function isLoggedIn() {
    return !!Meteor.user();
  };
  this.getForum = function getForum(id) {
    if (!id) { return null; }
    console.log(Template.currentData());
    console.log(id);
    console.log(`getforum: ${id}`);
    if (Template.instance().state.get('forum') === null) {
      const forum = Forums.findDoc(id);
      Template.instance().state.set('forum', forum);
    }
    // console.log(Template.instance().state.get('forum'));
    console.log(`getforum forumItem: ${JSON.stringify(Template.instance().state.get('forum'))}`);
    return Template.instance().state.get('forum');
  };
});

Template.Forum.events({
  'submit .text-editor-box'(event, instance) {
    event.stopPropagation();
    event.preventDefault();

    let author = null;
    if (instance.isLoggedIn()) {
      author = Meteor.user().profile.name;
    }
    const content = event.target['text-editor-textarea'].value;
    const dateCreated = new Date();
    const replies = [];
    const parentForum = instance.state.get('forum')._id;

    const newCommentData = {
      author, dateCreated, content, replies, parentForum,
    };

    // console.log(event);
    // console.log(instance);
    // console.log(newCommentData);

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Comments.getSchema().clean(newCommentData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const id = Comments.defineTopLevel(cleanData);
      const updatedForum = instance.state.get('forum');
      console.log(`updatedForum: ${JSON.stringify(updatedForum)}`);
      updatedForum.comments.push(id);
      console.log(`updatedForum: ${JSON.stringify(updatedForum)}`);
      Forums.update(updatedForum._id, {
        $set: { comments: updatedForum.comments },
      });
      instance.state.set('forum', updatedForum);
      event.target.reset();
      return true;
    }
    console.log('NOT VALID');
    const invalidKeys = instance.context.validationErrors();
    console.log(invalidKeys);
    return false;
  },
});

Template.Forum.helpers({
  helloWorld: function helloWorld() {
    return 'Hello world';
  },

  getForum: function getForum(id) {
    if (!id) { return null; }
    return Template.instance().getForum(id);
  }

});
