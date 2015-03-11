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





