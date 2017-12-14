import { Clubs } from '/imports/api/club/ClubCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { Departments } from '/imports/api/department/DepartmentCollection';
import { Events } from '/imports/api/event/EventCollection';
import { Majors } from '/imports/api/major/MajorCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Forums } from '/imports/api/forum/ForumCollection';
import { ClassTips } from '/imports/api/class-tip/ClassTipCollection';

Clubs.publish();
Courses.publish();
Departments.publish();
Events.publish();
Majors.publish();
Profiles.publish();
Comments.publish();
Forums.publish();
ClassTips.publish();
