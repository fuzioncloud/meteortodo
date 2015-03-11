// a JavaScript file loaded on both client and server

Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
      // To create tasks:
      // from a terminal in the app directory, run
      //    `meteor mongo'
      // to console into the app's local development database. At the prompt create tasks with:
      //    `db.tasks.insert({ text: "text for task here", createdAt: new Date() });`
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {
          sort: {
            createdAt: -1
          }
        });
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {
          sort: {
            createdAt: -1
          }
        });
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });


  // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
  Template.body.events({
    "submit .new-task": function (event) {
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
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  // below everything else within the client code
  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });

  if (Meteor.isServer) {
    Meteor.startup(function () {
      // code to run on server at startup
    });
  }
}
