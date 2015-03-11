# Creating your first app

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

>```javascript
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






