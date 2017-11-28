import { Clubs } from '/imports/api/club/ClubCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Forums } from '/imports/api/forum/ForumCollection';

Clubs.publish();
Majors.publish();
Profiles.publish();
Comments.publish();
Forums.publish();
