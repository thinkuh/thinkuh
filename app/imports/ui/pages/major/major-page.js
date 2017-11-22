import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Major_Page.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
});
