import passport from 'passport';
import { UserModel } from '@/db/models';
import { userService } from '@/core/services';

passport.serializeUser((user: UserModel, done) => {
  done(null, user.id);
});

// "userId" is the serialized value from the "serializeUser" function above
passport.deserializeUser(async (userId: string, done) => {
  try {
    const authenticatedUser = await userService.getById(userId);
    done(null, authenticatedUser);
  } catch (err) {
    done(err, undefined);
  }
});
