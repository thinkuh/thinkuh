import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Majors } from '/imports/api/major/MajorCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Clubs.getPublicationName());
  this.subscribe(Majors.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Profile_Page');
});

Template.Profile_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  clubs() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedClubs = profile.clubs;
    return profile && _.map(Clubs.findAll(),
        function makeClubObject(club) {
          return { label: club.name, selected: _.contains(selectedClubs, club.name) };
        });
  },
  majors() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedMajors = profile.majors;
    return profile && _.map(Majors.findAll(),
        function makeMajorObject(major) {
          return { label: major.name, selected: _.contains(selectedMajors, major.name) };
        });
  },
});

Template.Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const username = FlowRouter.getParam('username'); // schema requires username.
    const firstName = event.target.First.value;
    const lastName = event.target.Last.value;
    const email = event.target.Email.value;
    const picture = event.target.Picture.value;
    const standing = event.target['Class Standing'].value;
    const majors = _.map(_.filter(event.target.Majors.selectedOptions, (option) => option.selected), (option) => option.value);
    const clubs = _.map(_.filter(event.target['Clubs and Organizations'].selectedOptions, (option) => option.selected), (option) => option.value);
    const about = event.target['About Me'].value;

    const updatedProfileData = {
      username, firstName, lastName, email, picture, standing, majors, clubs, about,
    };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

