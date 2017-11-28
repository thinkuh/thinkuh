import { Template } from 'meteor/templating';
import { Majors } from '/imports/api/major/MajorCollection';

Template.Header_Item.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
});

Template.Header_Item.onCreated(function onCreated() {
  this.subscribe(Majors.getPublicationName());
});

Template.Header_Item.helpers({
  majors() {
    return Majors.find({}, { sort: { lastName: 1 } });
  },
});