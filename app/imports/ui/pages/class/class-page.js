import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { myJSON } from './initialize-class.js';

/*var json = require('/private/database/graphFile.json');*/

Template.Class_Page.onCreated(function() {
  /*this.skills = new ReactiveVar(json);*/
  const result = Meteor.call('myJSON', 1, 2);
  console.log(restoreJSON);

});

Template.Class_Page.helpers({
  skills: function (){
    return Template.instance().skills.get();
  }
});