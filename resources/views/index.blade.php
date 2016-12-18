<!DOCTYPE html>
<html>
    <head>
        <title>Yamb</title>

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

        <link type="text/css" rel="stylesheet" href="build/css/bootstrap.css">
        <link type="text/css" rel="stylesheet" href="build/css/app.css">

        <base href="/">
    </head>

    <body ng-app="yamb-v2">
        <header>
            <h1>Yamb<h1>
        </header>

        <div class="container-fluid" ui-view></div>

        <footer>
            <span>This is a footer</span>
        </footer>
        
        <script type="text/javascript" src="build/js/deps.js"></script>
        <script type="text/javascript" src="build/js/app.js"></script>
    </body>
</html>