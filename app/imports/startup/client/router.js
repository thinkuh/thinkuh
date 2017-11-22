import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { $ } from 'meteor/jquery';


/*                        LANDING ROUTE                       */

export const landingPageRouteName = 'Landing_Page';
FlowRouter.route('/', {
  name: landingPageRouteName,
  action() {
    BlazeLayout.render('Landing_Layout', { main: landingPageRouteName });
  },
});

/*                        DIRECTORY ROUTE                       */

function addDirectoryBodyClass() {
  $('body').addClass('directory-page-body');
}

function removeDirectoryBodyClass() {
  $('body').removeClass('directory-page-body');
}

export const directoryPageRouteName = 'Directory_Page';
FlowRouter.route('/directory', {
  name: directoryPageRouteName,
  action() {
    BlazeLayout.render('Directory_Layout', { main: directoryPageRouteName });
  },
  triggersEnter: [addDirectoryBodyClass],
  triggersExit: [removeDirectoryBodyClass],
});


/*                        USER ROUTES                      */


function addUserBodyClass() {
  $('body').addClass('user-layout-body');
}

function removeUserBodyClass() {
  $('body').removeClass('user-layout-body');
}

const userRoutes = FlowRouter.group({
  prefix: '/:username',
  name: 'userRoutes',
  triggersEnter: [addUserBodyClass],
  triggersExit: [removeUserBodyClass],
});

export const profilePageRouteName = 'Profile_Page';
userRoutes.route('/profile', {
  name: profilePageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: profilePageRouteName });
  },
});

export const filterPageRouteName = 'Filter_Page';
userRoutes.route('/filter', {
  name: filterPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: filterPageRouteName });
  },
});


/*                        MAJOR ROUTES                      */

function addMajorBodyClass() {
  $('body').addClass('major-page-body');
}

function removeMajorBodyClass() {
  $('body').removeClass('major-page-body');
}

const majorRoutes = FlowRouter.group({
  prefix: '/:username/:major',
  name: 'majorRoutes',
  triggersEnter: [addMajorBodyClass],
  triggersExit: [removeMajorBodyClass],
});

export const majorHomePageRouteName = 'Major_Page';
majorRoutes.route('/home', {
  name: majorHomePageRouteName,
  action() {
    BlazeLayout.render('Major_Layout', { main: majorHomePageRouteName });
  },
});

export const classPageRouteName = 'Class_Page';
majorRoutes.route('/class', {
  name: classPageRouteName,
  action() {
    BlazeLayout.render('Major_Layout', { main: classPageRouteName });
  },
});


/*                        MISC ROUTES                       */
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};
