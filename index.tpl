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
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><path fill="#FFF" d="M14.752 32.456l-7.72.002v7.553h7.72v-7.554zm9.65 0h-7.72v7.556h7.72v-7.556zm0-9.445h-7.72v7.556h7.72V23.01zm9.65 9.446h-7.72v7.556h7.72v-7.556zm0-9.445h-7.72v7.556h7.72V23.01zm9.648 9.446h-7.72v7.556h7.72v-7.556zm0-9.445h-7.72v7.556h7.72V23.01zm9.65 9.446l-7.72.002v7.553h7.72v-7.554zm-9.65-18.89h-7.72v7.556h7.72v-7.556zm31.938 23.106c-2.51-1.417-5.85-1.61-8.693-.792-.35-2.958-2.337-5.55-4.7-7.41l-.938-.738-.79.89c-1.58 1.79-2.052 4.768-1.838 7.053.16 1.68.697 3.388 1.756 4.737-.805.473-1.717.85-2.53 1.12-1.657.55-3.456.854-5.206.854H3.544l-.105 1.107c-.354 3.7.165 7.402 1.728 10.778l.673 1.343.078.124c4.622 7.68 12.74 10.914 21.584 10.914 17.125 0 31.248-7.48 37.734-23.284 4.335.222 8.77-1.033 10.89-5.082l.54-1.033-1.028-.578zm-57.77 19.982v.002c-2.18 0-3.955-1.735-3.955-3.866 0-2.132 1.774-3.866 3.954-3.866s3.954 1.732 3.954 3.865c0 2.13-1.77 3.864-3.95 3.864zm-.01-5.854c-1.137 0-2.06.9-2.06 2.013 0 1.11.924 2.01 2.06 2.01 1.134 0 2.057-.9 2.057-2.01 0-1.11-.922-2.013-2.057-2.013z"/></svg>
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
