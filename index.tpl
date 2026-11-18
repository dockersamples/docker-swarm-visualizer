<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Visualizer</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link href='//fonts.googleapis.com/css?family=Ubuntu+Mono|Open+Sans:400,700,400italic' rel='stylesheet' type='text/css'>
  <style type="text/css">
   .hidden{ display: none; }
  </style>
</head>
<body style='background:#254356'>
  <div class='tabs'>
    <button id='tab-physical'>
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><path fill="#FFF" transform="translate(4 18.296) scale(0.057520)" d="M1077.76,0c-75.81,0-137.27,61.46-137.27,137.27C940.48,61.46,879.02,0,803.21,0h-173.98v110.51c0,84.77,68.72,153.49,153.49,153.49h86.97v82.26h-84.37c-131.59,0-238.28-106.66-238.28-238.25V0H223.46C100.04,0,0,100.03,0,223.43v307.8c0,123.4,100.04,223.43,223.46,223.43h561.87c123.42,0,223.46-100.03,223.46-223.43v-267.23h89.46c84.77,0,153.49-68.72,153.49-153.49V0h-173.98Z"/></svg>
    </button>

  </div>
  <div id="app">
    <!-- content goes here -->
  </div>

  <script type="text/javascript">
    window.MS = '<%= MS %>';
  </script>
  <script type="text/javascript" src="app.js"></script>
</body>
</html>
