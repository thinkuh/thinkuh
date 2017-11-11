import { Clubs } from '/imports/api/club/ClubCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';

Clubs.publish();
Majors.publish();
Profiles.publish();
