import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { authService } from '@app/core/services';

passport.use(
  'local',
  new LocalStrategy(async (usernameOrEmail, password, done) => {
    try {
      const user = await authService.login(usernameOrEmail, password);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);
