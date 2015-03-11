// a JavaScript file loaded on both client and server

Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      // To create tasks:
      // from a terminal in the app directory, run
      //    `meteor mongo'
      // to console into the app's local development database. At the prompt create tasks with:
      //    `db.tasks.insert({ text: "text for task here", createdAt: new Date() });`
      return Tasks.find({}, {
        // Show newest tasks first
        sort: {
          createdAt: -1
        }
      });
    }
  });

  // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
  Template.body.events({
    "submit .new-task": function(event) {
      // This function is called when the new task form is submitted

      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });

  if (Meteor.isServer) {
    Meteor.startup(function () {
      // code to run on server at startup
    });
  }
}
