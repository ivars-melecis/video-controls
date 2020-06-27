function controlVideo(opts, cb) {
  const props = opts || {};
  const stateHolder = props.stateHolder || null;
  const videoEl = props.video || null;
  const playBtn = props.playBtn || null;
  const pauseBtn = props.pauseBtn || null;
  const muteBtn = props.muteBtn || null;
  const classPrefix = opts.classPrefix || 'video-';

  // Define classes
  const muteClass = props.muteClass || 'muted';
  const playClass = props.playClass || 'on';
  const pauseClass = props.pauseClass || 'off';

  // No video - no action
  if (videoEl instanceof Element === false) return null;

  let videoMuted = videoEl.muted;
  const videoAutoplays =
    videoEl.hasAttribute('autoplay') && videoEl.hasAttribute('muted');

  // Play video
  assignBtn(playBtn, 'play');
  if (playBtn instanceof Element && videoAutoplays) {
    classState(pauseClass, 'remove');
    classState(playClass);
  }

  // Pause video
  assignBtn(pauseBtn, 'pause');
  if (pauseBtn instanceof Element && !videoAutoplays) {
    classState(playClass, 'remove');
    classState(pauseClass);
  }

  // Mute video
  if (muteBtn instanceof Element) {
    videoMuted ? classState(muteClass) : classState(muteClass, 'remove');
  }

  assignBtn(muteBtn, 'mute');

  function assignBtn(btn, action) {
    if (btn instanceof Element === false) return null;

    btn.dataset.action = action;
    btn.addEventListener('click', controlVideoState, false);
  }

  function controlVideoState(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    updateState(action);
  }

  function updateState(action) {
    switch (action) {
      case 'play':
        videoEl.play();
        classState(pauseClass, 'remove');
        classState(playClass);
        break;
      case 'pause':
        videoEl.pause();
        classState(playClass, 'remove');
        classState(pauseClass);
        break;
      case 'mute':
        videoEl.muted = !videoEl.muted;
        videoEl.muted ? classState(muteClass) : classState(muteClass, 'remove');
        break;
      default:
        return null;
    }
  }

  function classState(className, action) {
    let classAction = action || 'add';
    if (stateHolder instanceof Element === false) return null;
    stateHolder.classList[classAction](classPrefix + className);
  }

  // On video end
  videoEl.addEventListener('ended', onEnd, false);

  function onEnd() {
    classState(playClass, 'remove');
    classState(pauseClass, 'remove');

    // Revert to initial mute state
    if (muteBtn instanceof Element) {
      videoEl.muted = videoMuted;
      videoMuted ? classState(muteClass) : classState(muteClass, 'remove');
    }

    if (cb && typeof cb === 'function') cb();
  }

  function destroy() {
    classState(playClass, 'remove');
    classState(pauseClass, 'remove');
    classState(muteClass, 'remove');
    if (playBtn instanceof Element)
      playBtn.removeEventListener('click', controlVideoState, false);
    if (pauseBtn instanceof Element)
      pauseBtn.removeEventListener('click', controlVideoState, false);
    if (muteBtn instanceof Element)
      muteBtn.removeEventListener('click', controlVideoState, false);
    videoEl.removeEventListener('ended', onEnd, false);
  }

  return destroy;
}
