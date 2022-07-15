import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";
export default scss`
@import url('https://fonts.googleapis.com/css2?family=Inter&family=Poppins:wght@400;500;600&display=swap');

.spotify-component {
  // all of these colors will eventually be controlled by the --tfl css var stuff so creators can customize the way they want
  --alpha-multiplier: 0.95;
  --background-primary: rgba(40, 40, 40, var(--alpha-multiplier));
  --background-tooltip: black;
  --progress-bar-background: rgba(255, 255, 255, calc(0.2 * var(--alpha-multiplier)));
  --progress-bar-complete: #71DBDB;
  --spotify-width: 400px;
  --spotify-height: 88px;
  --spotify-min-width: 200px;
  --spotify-min-height: 32px;
  --top-margin: 45px;
  width: var(--spotify-width);
  height: var(--spotify-height);
  margin-top: var(--top-margin);
  display: flex;
  //pretty styles
  transition: height 0.5s, margin 0.5s, width 0.5s;
  background: var(--background-primary);
  color: white;
  border-radius: var(--tfl-border-radius-md); //4px
  overflow: hidden; //prevents square image from overflowing
  box-shadow: 0px 10px 10px 0px rgba(black, calc(0.3 * var(--alpha-multiplier)));

  >.controls {
    pointer-events: none;
    white-space: nowrap;
    font-weight: 400;
    font-family: 'Inter', sans-serif;
    position: absolute;
    align-self: flex-start;
    width: inherit;
    text-align: right;
    transition: filter 0.5s;
    filter: opacity(1);

    >div {
      pointer-events: all;
      display: inline-block;
      cursor: pointer;
      padding: 5px 10px 0px 5px;
    }
  }

  >.album-art {
    pointer-events: none;
    height: inherit;
  }

  >.song-info {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 16px;

    >.artist-title-container {
      font-family: 'Poppins', sans-serif;
      padding-top: 6px;
      height: 100%;
      width: calc(var(--spotify-width) - var(--spotify-height) - 75px);
      transition: width 0.5s;

      >.song-title {
        transition: line-height 0.5s, margin 0.5s;
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        >a {
          color: white;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      >.artist-name {

        transition: padding 0.5s;
        padding-top: 1px;
        font-size: 14px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        >p {
          display: inline;

          &:after {
            content: ", ";
          }

          &:last-child:after {
            content: "";
          }

          >a {
            color: white;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }

    >.progress-text-container {
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      font-size: 10px;
      display: flex;
      padding-bottom: 5px;
      margin-right: 16px;

      >.progress {
        text-align: left;
        width: 100%;
      }

      >.length {
        text-align: right;
        width: 100%;
      }
    }

    >.progress-bar-outer {
      flex-shrink: 0;
      background: var(--progress-bar-background);
      height: 4px;
      border-radius: 10px;
      margin-right: 16px;
      margin-bottom: 9px;

      >.progress-bar-inner {
        --song-position: 0%;
        border-radius: inherit;
        height: 100%;
        background: var(--progress-bar-complete);
        //transition: width 0.1s linear;
        width: MIN(var(--song-position), 100%);
      }
    }
  }
}

.spotify-component.collapsed {
  margin-top: calc(var(--top-margin) + var(--spotify-height) - var(--spotify-min-height));
  width: var(--spotify-min-width);
  height: var(--spotify-min-height);

  >.controls {
    filter: opacity(0);
    pointer-events: none;

    >div {
      pointer-events: none;
    }
  }

  >.album-art {
    height: inherit;
  }

  >.song-info {
    >.artist-title-container {
      width: calc(var(--spotify-min-width) - var(--spotify-min-height) - 20px);

      >.song-title {
        pointer-events: none;
        line-height: 20px;
        margin-left: -7px;
      }

      >.artist-name {
        pointer-events: none;
        padding-left: 250px;
      }
    }
  }
}
`