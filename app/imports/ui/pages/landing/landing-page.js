import { Events } from '/imports/api/event/EventCollection';

Template.Landing_Page.helpers({
  events() {
    return Events.find({}, { sort: { name: 1 } });
  }
});