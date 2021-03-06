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

//export const commentPageRoutePage = 'Comment_Page';
//FlowRouter.route('/comment', {
//  name: commentPageRoutePage,
//  action() {
//    BlazeLayout.render('Comment_Page', { main: commentPageRoutePage });
//  },
//});


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

export const eventPageRouteName = 'Event_Page';
userRoutes.route('/events', {
  name: eventPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: eventPageRouteName });
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
  prefix: '/:major',
  name: 'majorRoutes',
  triggersEnter: [addMajorBodyClass],
  triggersExit: [removeMajorBodyClass],
});

export const majorHomePageRouteName = 'Major_Page';
majorRoutes.route('/home', {
  name: majorHomePageRouteName,
  action() {
    BlazeLayout.render('Major_Layout', { });
  },
});

export const majorClassPageRouteName = 'Class_Page';
majorRoutes.route('/class', {
  name: majorClassPageRouteName,
  action() {
    BlazeLayout.render('Major_Layout', { main: majorClassPageRouteName });
  },
});

export const majorForumPageRouteName = 'Forum_Page';
majorRoutes.route('/forum', {
  name: majorForumPageRouteName,
  action() {
    BlazeLayout.render('Major_Layout', { main: majorForumPageRouteName });
  },
});

/*                        COURSE ROUTES                      */

function addCourseBodyClass() {
  $('body').addClass('course-page-body');
}

function removeCourseBodyClass() {
  $('body').removeClass('course-page-body');
}

const courseRoutes = FlowRouter.group({
  prefix: '/:major/:course',
  name: 'courseRoutes',
  triggersEnter: [addCourseBodyClass],
  triggersExit: [removeCourseBodyClass],
});

export const coursePageRouteName = 'Course_Page';
courseRoutes.route('/home', {
  name: coursePageRouteName,
  action() {
    BlazeLayout.render('Course_Layout', { });
  },
});

export const courseForumPageRouteName = 'Forum_Page';
courseRoutes.route('/forum', {
  name: courseForumPageRouteName,
  action() {
    BlazeLayout.render('Course_Layout', { main: courseForumPageRouteName });
  },
});

/*                        MISC ROUTES                       */

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};
