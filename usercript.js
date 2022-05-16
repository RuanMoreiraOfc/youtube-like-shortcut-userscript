// ==UserScript==
// @name         Like a youtube video with (ALT + L)
// @version      0.2
// @description  Like a youtube video by keyboard shortcut
// @author       Ruan Moreira de Jesus(@ruanmoreiraofc)
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @resource     like-icon https://raw.githubusercontent.com/ant-design/ant-design-icons/master/packages/icons-svg/svg/filled/like.svg
// @grant        GM_getResourceText
// ==/UserScript==

{
  /**
   * @template T
   * @param {T} props
   **/
  const makeCreateGlobalStyle = (props) => {
    // *** DISCLAIMER: CONSTANT NAME LIKE THAT, TO TAKE ADVANTAGE OF `vscode-styled-components[Styled Components]`
    return createGlobalStyle;

    /**
     * @typedef {string} Text
     * @typedef {(props: T) => Text} BindedFunction
     * @param {Text[]} inputAsTextArray
     * @param {(BindedFunction | Text | false | undefined | null)[]} inputAsVariablesArray
     **/
    function createGlobalStyle(
      [...inputAsTextArray],
      ...inputAsVariablesArray
    ) {
      const inputAsResolvedVariablesArray = inputAsVariablesArray.map(
        (variableToResolve) => {
          if (
            variableToResolve === undefined ||
            variableToResolve === false ||
            variableToResolve === null
          ) {
            return '';
          }

          if (typeof variableToResolve === 'function') {
            return variableToResolve(props);
          }

          return variableToResolve;
        },
      );

      return inputAsTextArray
        .map((text, i) => `${text}${inputAsResolvedVariablesArray[i] || ''}`)
        .join('')
        .split('\n')
        .map((line) => line.trim())
        .join('')
        .replace(/\s+/g, ' ');
    }
  };

  const ICONS = Object.freeze({
    LIKE: GM_getResourceText('like-icon'),
  });

  const YOUTUBE_SPECS = Object.freeze({
    LIKE_COLOR: 'hsla(214 72% 63% / 1)',
    DISLIKE_COLOR: 'hsla(2 57% 48% / 1)',
    BUTTON: 'ytd-toggle-button-renderer',
    BUTTON_ACTIVE_STATE: 'style-default-active',
  });

  document.addEventListener(
    'keyup',
    (() => {
      let unmountLastInstance = () => {};

      return (event) => {
        const { key, altKey: isValid } = event;

        if (location.pathname !== '/watch') return;
        if (isValid !== true) return;
        if (key !== 'l') return;

        unmountLastInstance();
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const getIsButtonActive = (btn) =>
          btn.classList.contains(YOUTUBE_SPECS.BUTTON_ACTIVE_STATE);

        const button = document.querySelector(YOUTUBE_SPECS.BUTTON);
        button.click();
        unmountLastInstance = animateLike(getIsButtonActive(button));
      };
    })(),
  );

  /** @param {boolean} isLikeState */
  function animateLike(isLikeState = true) {
    const ANIMATED_LIKE_SPECS = Object.freeze({
      ID: 'TEMP_' + Math.round(Math.random() * 999_999),
      get ID_ICON_WRAPPER() {
        return `${this.ID}__icon-wrapper`;
      },
      get ANIMATION_TIMING_FUNCTION_BASE() {
        return 'cubic-bezier(0.8, 0.1, 0.4, 3)';
      },
      get ANIMATION_TIMING_FUNCTION_SHAKE() {
        return 'cubic-bezier(0.35, 0.05, 0.2, 1)';
      },
      get ANIMATION_TIMING_FUNCTION_FADE_OUT() {
        return 'ease';
      },
      get ANIMATION_FILL_MODE_BASE() {
        return 'forwards';
      },
      get ANIMATION_FILL_MODE_SHAKE() {
        return 'none';
      },
      get ANIMATION_DURATION_BASE() {
        return '300ms';
      },
      get ANIMATION_DURATION_FADE_OUT() {
        return `calc(${this.ANIMATION_DURATION_BASE} * 2)`;
      },
      get ANIMATION_DURATION_SHAKE() {
        return `calc(${this.ANIMATION_DURATION_BASE} * 2)`;
      },
      get ANIMATION_DELAY_SHAKE() {
        return this.ANIMATION_DURATION_BASE;
      },
      get ANIMATION_DELAY_FADE_OUT() {
        return `calc(${this.ANIMATION_DURATION_SHAKE} + ${this.ANIMATION_DELAY_SHAKE})`;
      },
      get ANIMATION_NAME_FADE_OUT() {
        return `play--fade-out__${this.ID}`;
      },
      get ANIMATION_NAME_REVEAL() {
        return `play--reveal__${this.ID}__icon`;
      },
      get ANIMATION_NAME_SCALE() {
        return `play--scale__${this.ID}__icon`;
      },
      get ANIMATION_NAME_TURN_RED() {
        return `play--turn-red__${this.ID}__icon`;
      },
      get ANIMATION_NAME_TURN_BLUE() {
        return `play--turn-blue__${this.ID}__icon`;
      },
      get ANIMATION_NAME_SHAKE() {
        return `play--shake__${this.ID}__icon`;
      },
    });

    const createGlobalStyle = makeCreateGlobalStyle(ANIMATED_LIKE_SPECS);

    const _STYLE_BASE = createGlobalStyle`
      #${(p) => p.ID} {
        background-color: hsla(0 0% 0% / 0.15);

        z-index: 9999;
        backdrop-filter: blur(8px);

        display: grid;
        place-items: center;

        position: fixed;
        inset: 0;

        animation-timing-function: ${(p) =>
          p.ANIMATION_TIMING_FUNCTION_FADE_OUT};
        animation-timing-function: ${(p) => p.ANIMATION_TIMING_FUNCTION_BASE};
        animation-duration: ${(p) => p.ANIMATION_DURATION_FADE_OUT};
        animation-delay: ${(p) => p.ANIMATION_DELAY_FADE_OUT};
        animation-name: ${(p) => p.ANIMATION_NAME_FADE_OUT};
      }

      #${(p) => p.ID_ICON_WRAPPER} {
        aspect-ratio: 1/1;
        width: min(25vmin, 10rem);

        transform: rotate(${isLikeState === true ? '0deg' : '180deg'});
      }

      #${(p) => p.ID_ICON_WRAPPER} svg {
        color: hsla(0 0% 95% / 1);
        fill: currentColor;

        animation-timing-function:
          ${(p) => p.ANIMATION_TIMING_FUNCTION_BASE},
          ${(p) => p.ANIMATION_TIMING_FUNCTION_BASE},
          ${(p) => p.ANIMATION_TIMING_FUNCTION_BASE},
          ${(p) => p.ANIMATION_TIMING_FUNCTION_SHAKE}
        ;
        animation-fill-mode:
          ${(p) => p.ANIMATION_FILL_MODE_BASE},
          ${(p) => p.ANIMATION_FILL_MODE_BASE},
          ${(p) => p.ANIMATION_FILL_MODE_BASE},
          ${(p) => p.ANIMATION_FILL_MODE_SHAKE}
        ;
        animation-duration:
          ${(p) => p.ANIMATION_DURATION_BASE},
          ${(p) => p.ANIMATION_DURATION_BASE},
          ${(p) => p.ANIMATION_DURATION_BASE},
          ${(p) => p.ANIMATION_DURATION_SHAKE}
        ;
        animation-delay:
          0ms,
          0ms,
          0ms,
          ${(p) => p.ANIMATION_DURATION_BASE}
        ;
        animation-name:
          ${(p) => p.ANIMATION_NAME_REVEAL},
          ${(p) => p.ANIMATION_NAME_SCALE},
          ${
            (p) =>
              isLikeState === true
                ? p.ANIMATION_NAME_TURN_BLUE
                : p.ANIMATION_NAME_TURN_RED //
          },
          ${
            (p) =>
              isLikeState === true //
                ? 'none'
                : p.ANIMATION_NAME_SHAKE //
          }
        ;
      }
    `;

    const _KEYFRAMES_BASE = createGlobalStyle`
      @keyframes ${(p) => p.ANIMATION_NAME_REVEAL} {
        from {
          clip-path: circle(0% at 50% 60%);
        }
        to {
          clip-path: circle(50% at 50% 60%);
        }
      }

      @keyframes ${(p) => p.ANIMATION_NAME_SCALE} {
        from {
          transform: scale(0);
        }
      }

      @keyframes ${(p) => p.ANIMATION_NAME_FADE_OUT} {
        to {
          opacity: 0;
        }
      }
    `;

    const _KEYFRAMES_LIKE = createGlobalStyle`
      @keyframes ${(p) => p.ANIMATION_NAME_TURN_BLUE} {
        to {
          fill: ${YOUTUBE_SPECS.LIKE_COLOR};
        }
      }
    `;

    const _KEYFRAMES_DISLIKE = createGlobalStyle`
      @keyframes ${(p) => p.ANIMATION_NAME_TURN_RED} {
        to {
          fill: ${YOUTUBE_SPECS.DISLIKE_COLOR};
        }
      }

      @keyframes ${(p) => p.ANIMATION_NAME_SHAKE} {
        from {
          transform: translate3d(0, 0, 0);
        }
        10%, 90% {
          transform: translate3d(-1px, 0, 0);
        }

        20%, 80% {
          transform: translate3d(2px, 0, 0);
        }

        30%, 50%, 70% {
          transform: translate3d(-4px, 0, 0);
        }

        40%, 60% {
          transform: translate3d(4px, 0, 0);
        }
      }
    `;

    const STYLE = `<style>${createGlobalStyle`
      ${_STYLE_BASE}
      ${_KEYFRAMES_BASE}
      ${isLikeState === true && _KEYFRAMES_LIKE}
      ${isLikeState === false && _KEYFRAMES_DISLIKE}
    `}</style>`;

    const buttonDOM = new DOMParser().parseFromString(
      `
        <div id=${ANIMATED_LIKE_SPECS.ID}>
          ${STYLE}
          <div id=${ANIMATED_LIKE_SPECS.ID_ICON_WRAPPER}>
            ${ICONS.LIKE}
          </div>
        </div>
      `,
      'text/html',
    ).body.firstElementChild;

    document.body.appendChild(buttonDOM);
    buttonDOM.addEventListener('animationend', unmountSetup);

    function unmountSetup(event) {
      const hasFadeOut =
        event.animationName === ANIMATED_LIKE_SPECS.ANIMATION_NAME_FADE_OUT;

      if (hasFadeOut === false) return;

      unmount();
    }

    function unmount() {
      buttonDOM.removeEventListener('animationend', unmountSetup);
      buttonDOM.remove();
    }

    // ***

    function forcedUnmount() {
      const isButtonInDOM = document.body.contains(buttonDOM);

      if (isButtonInDOM === false) return;

      unmount();
    }

    return forcedUnmount;
  }
}
