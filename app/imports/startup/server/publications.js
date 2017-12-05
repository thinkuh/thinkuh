import { Clubs } from '/imports/api/club/ClubCollection';
import { Departments } from '/imports/api/department/DepartmentCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Forums } from '/imports/api/forum/ForumCollection';

Clubs.publish();
Departments.publish();
Majors.publish();
Profiles.publish();
Comments.publish();
Forums.publish();
