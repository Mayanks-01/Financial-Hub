const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { mysqlPool } = require('./config/db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        const [rows] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
        let user = rows[0];

        if (!user) {
          const [result] = await mysqlPool.query(
            'INSERT INTO users (name, email, password, phone, gender, age, address, state, pincode, pan_card, annual_salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, '', '', '', '', '', '', '', '', '']
          );
          user = { user_id: result.insertId, name, email, role: 'user' };
        }

        const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        return done(null, { token, user: { name: user.name } });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;