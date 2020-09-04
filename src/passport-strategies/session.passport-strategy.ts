import passport from 'passport';
import { UserModel } from '@app/db/models';
import { userService } from '@app/core/services';

passport.serializeUser((user: UserModel, done) => {
  done(null, user.id);
});

// "userId" is the serialized value from the "serializeUser" function above
passport.deserializeUser(async (userId: string, done) => {
  try {
    const authenticatedUser = await userService.getById(userId);
    done(null, authenticatedUser);
  } catch (err) {
    done(err, null);
  }
});

// We extend the global Express User interface with our User model
declare global {
  namespace Express {
    // tslint:disable-next-line: no-empty-interface
    interface User extends UserModel {}
  }
}
