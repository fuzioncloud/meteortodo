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






