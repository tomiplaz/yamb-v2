<!DOCTYPE html>
<html>
    <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-115146709-3"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-115146709-3');
        </script>

        <title>Yamb</title>

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

        <meta name="author" content="Tomislav Plazonic">
        <meta name="decription" content="Play a game of Yamb! Try to set the highest score, view leaderboards and statistics!">
        <meta name="keywords" content="yamb Yamb jamb Jamb yahtzee Yahtzee yacht Yacht game pen and paper dice roll luck play leaderboard leaderboards statistics stats">

        <link type="text/css" rel="stylesheet" href="css/bootstrap.css">
        <link type="text/css" rel="stylesheet" href="css/deps.css">
        <link type="text/css" rel="stylesheet" href="css/app.css">

        <link rel="prefetch" href="img/dice/1.png">
        <link rel="prefetch" href="img/dice/2.png">
        <link rel="prefetch" href="img/dice/3.png">
        <link rel="prefetch" href="img/dice/4.png">
        <link rel="prefetch" href="img/dice/5.png">
        <link rel="prefetch" href="img/dice/6.png">

        <base href="/">
    </head>

    <body ng-app="yamb-v2" class="m-b-20">
        <div class="container-fluid" ui-view></div>

        <script type="text/javascript" src="js/deps.js"></script>
        <script type="text/javascript" src="js/app.js"></script>
    </body>
</html>