NGL APP
tech stack:

express.js
node.js
mongodb
redis/cache
jwt
bcrypt
rate limiter
load balancer
nginx
login with Google. [Social-App]
features:

authentication flow:

register.
send verification email. [otp,link]
verify email using. [otp,link]
login.
forgot password.
reset password.
login with Google.
user flow:

update profile.
view profile.
view all users.
messages flow:

send message.
view incoming messages.
delete a specific message.
no SQL
high availability. [view]
eventual consistency.[]
OTP [one-time password]
generate OTP.[register,reset-password,vodafone-cash,place-order]
save OTP into DB within the register.
delete OTP after usage verify an account.
delete OTP after 10 minutes.[TTL] >> time to live.
modules :
commonJs -> ES5 -> const require() >> module.exports = fn;
moduleJs -> ES6 -> import fn from 'module-name' >> export fn;
============================

todo session2:
refactor folder structure.✅
register.✅
verify email using otp.✅
login how to send token in res.[cookie]✅
=============================

todo session3:
how to access the token from req.
customize error handler.
==============================

todo session4:
send otp
reset password
custom logger
apply validation
=================================

session5:
login with google.
=================================

todo session6:
caching
hash-map >> user-1 = {name,email,password}
key-value >> karam-el-sham:[{},{},{}]
not a feature but a mandatory feature.
reduce latency.
deliver data faster.
avoid repeated queries.
reduce a database load.
=========================================

todo session7:
refactor to Main.js >> 3 files.✅
correlation id.✅
idempotency.✅
send message - anonymous/public.
===========================================

todo session8:
upload files.
how to validate file type.[mimetype]
magic numbers validation.
s3 bucket.
=============================================

todo session9
refresh tokens.
load balancer.
rate limiting [network,application]
mailjet.
===============================================

clustering.
deploy mongodb on the cloud.
ratelimiting application layer.
vercel.
switch to store OTPs into cache.
================================================

get all messages. >> {_id,content}
request sender to know who send the message.
create a conversation between sender and receiver.
2 step verification.