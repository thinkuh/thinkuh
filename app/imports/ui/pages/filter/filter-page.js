import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Majors } from '/imports/api/major/MajorCollection';

const selectedMajorsKey = 'selectedMajors';

Template.Filter_Page.onCreated(function onCreated() {
  this.subscribe(Majors.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedMajorsKey, undefined);
});

Template.Filter_Page.helpers({
  profiles() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedMajorsKey)) {
      const majors = Profiles.findDoc(FlowRouter.getParam('username')).majors;
      Template.instance().messageFlags.set(selectedMajorsKey, majors);
    }

    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const selectedMajors = Template.instance().messageFlags.get(selectedMajorsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.majors, selectedMajors).length > 0);
  },

  majors() {
    return _.map(Majors.findAll(),
        function makeMajorObject(major) {
          return {
            label: major.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedMajorsKey), major.name),
          };
        });
  },
});

Template.Filter_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Majors.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedMajorsKey, _.map(selectedOptions, (option) => option.value));
  },
});
