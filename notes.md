# Meteor Tutorial

## Creating your first app

To create a Meteor app, open your terminal and type:

>```javascript
meteor create simple-todos
```

This will create a new folder called simple-todos with all of the files that a Meteor app needs:

>```
simple-todos.js       # a JavaScript file loaded on both client and server
simple-todos.html     # an HTML file that defines view templates
simple-todos.css      # a CSS file to define your app's styles
.meteor               # internal Meteor files
```

To run the newly created app:

>```sh
cd simple-todos
meteor
```

Open your web browser and go to http://localhost:3000 to see the app running.

You can play around with this default app for a bit before we continue. For example, try editing the text in `<h1>` inside `simple-todos.html` using your favorite text editor. When you save the file, the page in your browser will automatically update with the new content. We call this "hot code push".

Now that you have some experience editing the files in your Meteor app, let's start working on a simple todo list application.

>See the code for step 1 on GitHub!
* [simple-todos.html](http://gitlab.fuzioncloud.com/Zeb/meteor_todo_tutorial/blob/master/meteorTodo.html)
* [simple-todos.js](http://gitlab.fuzioncloud.com/Zeb/meteor_todo_tutorial/blob/master/meteorTodo.js)
* [simple-todos.css](http://gitlab.fuzioncloud.com/Zeb/meteor_todo_tutorial/blob/master/meteorTodo.css)
* [diff of all files](http://gitlab.fuzioncloud.com/Zeb/meteor_todo_tutorial/commit/1cd2c8f5b153862aad723cb34c70bb56c17750fa)



## Defining views with templates

To start working on our todo list app, let's replace the code of the default starter app with the code below. Then we'll talk about what it does.


>```
>    `<!-- simple-todos.html -->`
>
    <head>
       <title>Todo List</title>
     </head>
>
    <body>
      <div class="container">
        <header>
          <h1>Todo List</h1>
        </header>
>
        <ul>
          {{#each tasks}}
            {{> task}}
          {{/each}}
        </ul>
      </div>
    </body>
>
    <template name="task">
      <li>{{text}}</li>
    </template>


simple-todo.js
>```javascript
    // simple-todos.js
    if (Meteor.isClient) {
      // This code only runs on the client
      Template.body.helpers({
        tasks: [
        { text: "This is task 1" },
        { text: "This is task 2" },
        { text: "This is task 3" }
    ]
      });
    }
    ```

In our browser, the app will now look much like this:

>   Todo List
>
    * This is task 1
    * This is task 2
    * This is task 3


Now let's find out what all these bits of code are doing!

### HTML files in Meteor define templates

Meteor parses all of the HTML files in your app folder and identifies three top-level tags: `<head>`, `<body>`, and `<template>`.

Everything inside any `<head>` tags is added to the head section of the HTML sent to the client, and everything inside `<body>` tags is added to the body section, just like in a regular HTML file.

Everything inside `<template>` tags is compiled into Meteor templates, which can be included inside HTML with `{{> templateName}}` or referenced in your JavaScript with `Template.templateName`.

### Adding logic and data to templates

All of the code in your HTML files is compiled with Meteor's Spacebars compiler. Spacebars uses statements surrounded by double curly braces such as `{{#each}}` and `{{#if}}` to let you add logic and data to your views.

You can pass data into templates from your JavaScript code by defining helpers. In the code above, we defined a helper called tasks on Template.body that returns an array. Inside the body tag of the HTML, we can use `{{#each tasks}}` to iterate over the array and insert a task template for each value. Inside the #each block, we can display the text property of each array item using `{{text}}`.

In the next step, we will see how we can use helpers to make our templates display dynamic data from a database collection.

### Adding CSS

Before we go any further, let's make our app look nice by adding some CSS.

Since this tutorial is focused on working with HTML and JavaScript, just copy all the CSS code below into `simple-todos.css`. This is all the CSS code you will need until the end of the tutorial. The app will still work without the CSS, but it will look much nicer if you add it.


## Storing tasks in a collection

Collections are Meteor's way of storing persistent data. The special thing about collections in Meteor is that they can be accessed from both the server and the client, making it easy to write view logic without having to write a lot of server code. They also update themselves automatically, so a template backed by a collection will automatically display the most up-to-date data.

Creating a new collection is as easy as calling `MyCollection = new Mongo.Collection("my-collection");` in your JavaScript. On the server, this sets up a MongoDB collection called `my-collection`; on the client, this creates a cache connected to the server collection. We'll learn more about the client/server divide in step 12, but for now we can write our code with the assumption that the entire database is present on the client.

Let's update our JavaScript code to get our tasks from a collection instead of a static array:

>```javascript
    // simple-todos.js
    Tasks = new Mongo.Collection("tasks");
>
    if (Meteor.isClient) {
      // This code only runs on the client
      Template.body.helpers({
        tasks: function () {
          return Tasks.find({});
        }
      });
    }
    ```

When you make these changes to the code, you'll notice that the tasks that used to be in the todo list have disappeared. That's because our database is currently empty — we need to insert some tasks!

### Inserting tasks from the console

Items inside collections are called documents. Let's use the server database console to insert some documents into our collection. In a new terminal tab, go to your app directory and type:

>```sh
meteor mongo
    ```

This opens a console into your app's local development database. Into the prompt, type:

>```sh
db.tasks.insert({ text: "Hello world!", createdAt: new Date() });
    ```

In your web browser, you will see the UI of your app immediately update to show the new task. You can see that we didn't have to write any code to connect the server-side database to our front-end code — it just happened automatically.

Insert a few more tasks from the database console with different text. In the next step, we'll see how to add functionality to our app's UI so that we can add tasks without using the database console.


## Adding tasks with a form

In this step, we'll add an input field for users to add tasks to the list.

First, let's add a form to our HTML:

>```html
   <header>
     <h1>Todo List</h1>
>
   <!-- add a form below the h1 -->
    <form class="new-task">
      <input type="text" name="text" placeholder="Type to add new tasks" />
    </form>
   </header>
```

Here's the JavaScript code we need to add to listen to the submit event on the form:

>```javascript
    // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
    Template.body.events({
      "submit .new-task": function (event) {
    // This function is called when the new task form is submitted
>
    var text = event.target.text.value;
>
    Tasks.insert({
      text: text,
      createdAt: new Date() // current time
    });
>
    // Clear form
    event.target.text.value = "";
>
    // Prevent default form submit
    return false;
      }
    });
    ```

Now your app has a new input field. To add a task, just type into the input field and hit enter. If you open a new browser window and open the app again, you'll see that the list is automatically synchronized between all clients.

### Attaching events to templates

Event listeners are added to templates in much the same way as helpers are: by calling `Template.templateName.events(...)` with a dictionary. The keys describe the event to listen for, and the values are event handlers that are called when the event happens.

In our case above, we are listening to the submit event on any element that matches the CSS selector `.new-task`. When this event is triggered by the user pressing enter inside the input field, our event handler function is called.

The event handler gets an argument called event that has some information about the event that was triggered. In this case `event.target` is our form element, and we can get the value of our input with `event.target.text.value`. You can see all of the other properties of the event object by adding a `console.log(event)` and inspecting the object in your browser console.

The last two lines of our event handler perform some cleanup — first we make sure to make the input blank, and then we return false to tell the web browser to not do the default form submit action since we have already handled it.

### Inserting into a collection

Inside the event handler, we are adding a task to the tasks collection by calling `Tasks.insert()`. We can assign any properties to the task object, such as the time created, since we don't ever have to define a schema for the collection.

Being able to insert anything into the database from the client isn't very secure, but it's okay for now. In step 10 we'll learn how we can make our app secure and restrict how data is inserted into the database.

### Sorting our tasks

Currently, our code displays all new tasks at the bottom of the list. That's not very good for a task list, because we want to see the newest tasks first.

We can solve this by sorting the results using the `createdAt` field that is automatically added by our new code. Just add a sort option to the find call inside the tasks helper:

>```javascript
 Template.body.helpers({
    tasks: function () {
      // Show newest tasks first
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });
  ```

In the next step, we'll add some very important todo list functions: checking off and deleting tasks.

## Chapter 5
## Checking off and deleting tasks

Until now, we have only interacted with a collection by inserting documents. Now, we will learn how to update and remove them.

Let's add two elements to our `task` template, a checkbox and a delete button:

>```html
<!-- replace the existing task template with this code -->
<template name="task">
  <li class="{{#if checked}}checked{{/if}}">
    <button class="delete">&times;</button>
>
    <input type="checkbox" checked="{{checked}}" class="toggle-checked" />
>
    <span class="text">{{text}}</span>
  </li>
</template>
```

We have added UI elements, but they don't do anything yet. We should add some event handlers:

>```javascript
// In the client code, below everything else
Template.task.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Tasks.update(this._id, {$set: {checked: ! this.checked}});
  },
  "click .delete": function () {
    Tasks.remove(this._id);
  }
});
```

### Getting data in event handlers

Inside the event handlers, this refers to an individual task object. In a collection, every inserted document has a unique `_id` field that can be used to refer to that specific document. We can get the `_id` of the current task with `this._id`. Once we have the `_id`, we can use update and remove to modify the relevant task.

### Update

The `update` function on a collection takes two arguments. The first is a selector that identifies a subset of the collection, and the second is an update parameter that specifies what should be done to the matched objects.

In this case, the selector is just the `_id` of the relevant task. The update parameter uses `$set` to toggle the `checked` field, which will represent whether the task has been completed.

### Remove

The remove function takes one argument, a selector that determines which item to remove from the collection.

### Using object properties or helpers to add/remove classes

If you try checking off some tasks after adding all of the above code, you will see that checked off tasks have a line through them. This is enabled by the following snippet:

>```html
  <li class="{{#if checked}}checked{{/if}}">
  ```
  
With this code, if the checked property of a task is true, the checked class is added to our list item. Using this class, we can make checked-off tasks look different in our CSS.


## Chapter 6
## Deploying your app

Now that we have a working todo list app, we can share it with our friends! Meteor makes it really easy to put an app up on the internet where other people can use it.

Simply go to your app directory, and type:

>```sh
  meteor deploy my_app_name.meteor.com
  ```

Once you answer all of the prompts and the upload completes, you can go to `http://my_app_name.meteor.com` and use your app from anywhere.

Try opening the app on multiple devices such as your phone and your friend's computer. Add, remove, and check off some tasks and you will see that the UI of your app is really fast. That's because Meteor doesn't wait for the server to respond before updating the interface - we'll talk about this more in step 11.

Congratulations, you've made a working app that you can now use with your friends! In later steps we will add more functionality involving multiple users, private tasks, and search. First, we'll take a detour to see that while we were building a web app, we also created a pretty nice mobile app along the way.

## Ch 7
## Running your app on Android or iOS

So far, we've been building our app and testing only in a web browser, but Meteor has been designed to work across different platforms - your simple todo list website can become an iOS or Android app in just a few commands.

Meteor makes it easy to set up all of the tools required to build mobile apps, but downloading all of the programs can take a while - for Android the download is about 300MB and for iOS you need to install Xcode which is about 2GB. If you don't want to wait to download these tools, feel free to skip to the next step.

#### Running on an Android emulator

In the terminal, go to your app folder and type:

>```sh
meteor install-sdk android
```

This will help you install all of the necessary tools to build an Android app from your project. When you are done installing everything, type:

>```
meteor add-platform android
```

After you agree to the license terms, type:

>```sh
meteor run android
```

After some initialization, you will see an Android emulator pop up, running your app inside a native Android wrapper. The emulator can be somewhat slow, so if you want to see what it's really like using your app, you should run it on an actual device.

### Running on an Android device

First, complete all of the steps above to set up the Android tools on your system. Then, make sure you have [USB Debugging enabled on your phone](http://developer.android.com/tools/device.html#developer-device-options) and the phone is plugged into your computer with a USB cable. Also, you must quit the Android emulator before running on a device.

Then, run the following command:

>```sh
meteor run android-device
```

The app will be built and installed on your device. If you want to point your app to the server you deployed in the previous step, run:

>```sh
meteor run android-device --mobile-server my_app_name.meteor.com
```

### Running on an iOS simulator (Mac Only)

If you have a Mac, you can run your app inside the iOS simulator.

Go to your app folder and type:

>```sh
meteor install-sdk ios
```

This will run you through the setup necessary to build an iOS app from your project. When you're done, type:

>```sh
meteor add-platform ios
meteor run ios
```

You will see the iOS simulator pop up with your app running inside.

Running on an iPhone or iPad (Mac Only; requires Apple developer account)

If you have an Apple developer account, you can also run your app on an iOS device. Run the following command:

>```sh
meteor run ios-device
```

This will open Xcode with a project for your iOS app. You can use Xcode to then launch the app on any device or simulator that Xcode supports.

If you want to point your app at the previously deployed server, run:

>```sh
meteor run ios-device --mobile-server my_app_name.meteor.com
```

Now that we have seen how easy it is to deploy our app and run it on mobile, let's get to adding some more features.

### Ch 8
## Storing temporary UI state in Session

In this step, we'll add a client-side data filtering feature to our app, so that users can check a box to only see incomplete tasks. We're going to learn how to use `Session` to store temporary reactive state on the client.

First, we need to add a checkbox to our HTML:

>```html
<!-- add the checkbox to <body> right below the h1 -->
<label class="hide-completed">
  <input type="checkbox" checked="{{hideCompleted}}" />
  Hide Completed Tasks
</label>
```

Then, we need an event handler to update a `Session` variable when the checkbox is checked or unchecked. `Session` is a convenient place to store temporary UI state, and can be used in helpers just like a collection.

>```javascript
// Add to Template.body.events
"change .hide-completed input": function (event) {
  Session.set("hideCompleted", event.target.checked);
}
```

Now, we need to update `Template.body.helpers`. The code below has a new if block to filter the tasks if the checkbox is checked, and a helper to make sure the checkbox represents the state of our Session variable.

>```javascript
// Replace the existing Template.body.helpers
Template.body.helpers({
  tasks: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the tasks
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  }
});
```

Now if you check the box, the task list will only show tasks that haven't been completed.

### Session is a reactive data store for the client

Until now, we have stored all of our state in collections, and the view updated automatically when we modified the data inside these collections. This is because Meteor.Collection is recognized by Meteor as a *reactive data source*, meaning Meteor knows when the data inside has changed. `Session` is the same way, but is not synced with the server like collections are. This makes `Session` a convenient place to store temporary UI state like the checkbox above. Just like with collections, we don't have to write any extra code for the template to update when the `Session` variable changes — just calling `Session.get(...)` inside the helper is enough.

### One more feature: Showing a count of incomplete tasks

Now that we have written a query that filters out completed tasks, we can use the same query to display a count of the tasks that haven't been checked off. To do this we need to add a helper and change one line of the HTML.

>```javascript
// Add to Template.body.helpers
incompleteCount: function() {
  return Tasks.find({checked: {$ne: true}}).count();
}
```

/

>```html
><!--display the count at the end pf the <h1> tag-->
><h1>Todo List ({{incompleteCount}})</h1>
>```

## Ch 9
## Adding user accounts

Meteor comes with an accounts system and a drop-in login user interface that lets you add multi-user functionality to your app in minutes.

To enable the accounts system and UI, we need to add the relevant packages. In your app directory, run the following command:

>```sh
meteor add accounts-ui accounts-password
```

In the HTML, right under the checkbox, include the following code to add a login dropdown:

>```html
{{> loginButtons}}
```

Then, in your JavaScript, add the following code to configure the accounts UI to use usernames instead of email addresses:

>```javascript
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Now users can create accounts and log into your app! This is very nice, but logging in and out isn't very useful yet. Let's add two functions:

1. Only display the new task input field to logged in users
2. Show which user created each task

To do this, we will add two new fields to the tasks collection:

1. `owner` - the `_id` of the user that created the task.
2. `username` - the username of the user that created the task. We will save the username directly in the task object so that we don't have to look up the user every time we display the task.

First, let's add some code to save these fields into the submit `.new-task` event handler:

>```javascript
Tasks.insert({
  text: text,                        
  createdAt: new Date(),            // current time
  owner: Meteor.userId(),           // _id of logged in user
  username: Meteor.user().username  // username of logged in user
});
```

Then, in our HTML, add an #if block helper to only show the form when there is a logged in user:

>```html
{{#if currentUser}}
  <form class="new-task">
    <input type="text" name="text" placeholder="Type to add new tasks" />
  </form>
{{/if}}
```

Finally, add a Spacebars statement to display the `username` field on each task right before the text:

>```html
<span class="text"><strong>{{username}}</strong> - {{text}}</span>
```

Now, users can log in and we can track which user each task belongs to. Let's look at some of the concepts we just discovered in more detail.

### Automatic accounts UI

If our app has the `accounts-ui` package, all we have to do to add a login dropdown is include the `loginButtons` template with `{{> loginButtons}}`. This dropdown detects which login methods have been added to the app and displays the appropriate controls. In our case, the only enabled login method is `accounts-password`, so the dropdown displays a password field. If you are adventurous, you can add the `accounts-facebook` package to enable Facebook login in your app - the Facebook button will automatically appear in the dropdown.

### Getting information about the logged-in user

In your HTML, you can use the built-in `{{currentUser}}` helper to check if a user is logged in and get information about them. For example, `{{currentUser.username}}` will display the logged in user's username.

In your JavaScript code, you can use `Meteor.userId()` to get the current user's `_id`, or `Meteor.user()` to get the whole user document.

In the next step, we will learn how to make our app more secure by doing all of our data validation on the server instead of the client.




























