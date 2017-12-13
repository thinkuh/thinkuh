import { Template } from 'meteor/templating';
import { Events } from '/imports/api/event/EventCollection';

Template.Event_Page.helpers({
  events() {
    return Events.find({}, { sort: { name: 1 } });
  }
});

Template.Event_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
});