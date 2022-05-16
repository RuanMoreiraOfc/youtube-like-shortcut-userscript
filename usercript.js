// ==UserScript==
// @name         Like a youtube video with (ALT + L)
// @version      0.1
// @description  Like a youtube video by keyboard shortcut
// @author       Ruan Moreira de Jesus(@ruanmoreiraofc)
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// ==/UserScript==

{
  const YOUTUBE_SPECS = Object.freeze({
    LIKE_BUTTON: 'ytd-toggle-button-renderer',
  });

  document.addEventListener('keyup', (event) => {
    const { key, altKey: isValid } = event;

    if (isValid === false) return;
    if (key !== 'l') return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const button = document.querySelector(YOUTUBE_SPECS.LIKE_BUTTON);

    button.click();
  });
}
