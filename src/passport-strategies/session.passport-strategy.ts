import passport from 'passport';
import { User } from '@app/db/models';
import { userService } from '@app/core/services';

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (user: User, done) => {
  try {
    const authenticatedUser = await userService.getById(user.id);
    done(null, authenticatedUser);
  } catch (err) {
    done(err, null);
  }
});
