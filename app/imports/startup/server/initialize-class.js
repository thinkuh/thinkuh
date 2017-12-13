import { Meteor } from 'meteor/meteor';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { _ } from 'meteor/underscore';
/*
import { Assets } from 'meteor/assets'

let restoreJSON = {};
if (Meteor.isServer) {
  restoreJSON = JSON.parse(Assets.getText('database/graphFile.json'));
return restoreJSON;
}

export const myJSON = restoreJSON;
*/
