import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ClassTips } from '/imports/api/class-tip/ClassTipCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Parser, HtmlRenderer } from 'commonmark';

Template.Class_Tip.onCreated(function onCreated() {
  this.subscribe(ClassTips.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  console.log(`ClassTips.getPublicationName: ${ClassTips.getPublicationName()}`)

  this.getClassTip = function getClassTip(id) {
    if (!id) { return null; }
    return ClassTips.findDoc(id);
  };
});

Template.Class_Tip.onRendered(function () {
  console.log('Class_Tip: Hey there!');
});

Template.Class_Tip.helpers({
  getClassTip(id) {
    return Template.instance().getClassTip(id);
  },
});

