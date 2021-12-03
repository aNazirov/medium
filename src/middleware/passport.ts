import { Strategy, ExtractJwt } from 'passport-jwt';
import { config } from 'dotenv';
import { Users } from '../models';
import { PassportStatic } from 'passport';

config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.key,
};
const passportStatic = (passport: PassportStatic) => {
  passport.use(
    new Strategy(options,
      async (payload, done) => {
        try {
          const user = await Users.default.findOne({ id: payload.userId });
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (e) {
          done(e, false);
        }
      },
    ));
}

export default passportStatic