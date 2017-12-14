import { Template } from 'meteor/templating';

Template.Class_Tip_Textbox.onRendered(function onCreated() {
  this.$('.ui.dropdown').dropdown();
});

