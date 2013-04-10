# Live video chat integration with FirePad.io
Add video chat with [FirePad](http://firepad.io)

## How To Use:
1. Add `videoChatTokBox.js` into your html file  
  `<script src="/videoChatTokBox.js"></script>`
2. Create a dom element to contain your video chat  
  `<div id="opentokVideos" style="..."></div>`
3. Start your video chat by calling the following lines of code  
  * replace '1127' with your [TokBox](http://tokbox.com) key and replace 'opentokVideos' with the id of the element you created in step 2:  
  `a = new TBStart("1127", "opentokVideos");`  
  `a.startVideo();`

