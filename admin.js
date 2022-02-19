const AdminJS = require('adminjs');
const AdminJSMongoose = require('@adminjs/mongoose');
AdminJS.registerAdapter(AdminJSMongoose);

const menu = {
  mongoose: { name: 'mongooseResources', icon: 'SpineLabel' }
}

module.exports = {
  resources: [User,Booking],
}