/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Story } from '../../types/story';

const STORY_DURATION_MS = 5000;

interface StoryViewerProps {
  stories: Story[];
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const progressFill = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const viewerStyle = css`
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
`;

const progressRowStyle = css`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  z-index: 3;
`;

const progressTrackStyle = css`
  flex: 1;
  height: 2.5px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 2px;
  overflow: hidden;
`;

const progressFillBaseStyle = css`
  height: 100%;
  width: 0%;
  background: #fff;
  border-radius: 2px;
`;

const progressFillFullStyle = css`
  width: 100%;
`;

const progressFillActiveStyle = (running: boolean) => css`
  animation-name: ${progressFill};
  animation-duration: ${STORY_DURATION_MS}ms;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-play-state: ${running ? 'running' : 'paused'};
`;

const headerStyle = css`
  position: absolute;
  top: 20px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 3;
`;

const headerAvatarStyle = css`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
`;

const headerUsernameStyle = css`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  flex: 1;
`;

const closeBtnStyle = css`
  background: none;
  border: none;
  color: #fff;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 8px;
`;

const imageStyle = (loaded: boolean) => css`
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${loaded ? 1 : 0};
  transform: scale(${loaded ? 1 : 1.02});
  transition: opacity 0.25s ease, transform 0.25s ease;
`;

const spinnerWrapStyle = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const spinnerStyle = css`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const tapZoneBaseStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
`;

const tapZoneLeftStyle = css`
  left: 0;
  width: 35%;
`;

const tapZoneRightStyle = css`
  right: 0;
  width: 65%;
`;

export function StoryViewer({ stories, activeIndex, onNext, onPrev, onClose }: StoryViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const story = stories[activeIndex];

  useEffect(() => {
    setLoaded(false);
  }, [activeIndex, restartKey]);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(onNext, STORY_DURATION_MS);
    return () => clearTimeout(timer);
  }, [loaded, activeIndex, restartKey, onNext]);

  const handleLeftTap = () => {
    if (activeIndex > 0) {
      onPrev();
    } else {
      setRestartKey((k) => k + 1);
    }
  };

  const handleImageLoad = () => {
    setLoaded(true);
  };

  return (
    <div css={viewerStyle} data-testid="story-viewer">
      <div css={progressRowStyle}>
        {stories.map((s, i) => (
          <div css={progressTrackStyle} key={s.id}>
            {i < activeIndex ? (
              <div css={[progressFillBaseStyle, progressFillFullStyle]} />
            ) : i === activeIndex ? (
              <div
                css={[progressFillBaseStyle, progressFillActiveStyle(loaded)]}
                key={`${activeIndex}-${restartKey}`}
              />
            ) : (
              <div css={progressFillBaseStyle} />
            )}
          </div>
        ))}
      </div>

      <div css={headerStyle}>
        <img css={headerAvatarStyle} src={story.avatar} alt={story.username} />
        <span css={headerUsernameStyle} data-testid="story-username">
          {story.username}
        </span>
        <button css={closeBtnStyle} onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>

      {!loaded && (
        <div css={spinnerWrapStyle}>
          <div css={spinnerStyle} />
        </div>
      )}

      <img
        key={story.id}
        css={imageStyle(loaded)}
        src={story.image}
        alt={story.username}
        data-testid={loaded ? 'story-image-loaded' : 'story-image'}
        onLoad={handleImageLoad}
      />

      <div
        css={[tapZoneBaseStyle, tapZoneLeftStyle]}
        data-testid="tap-zone-left"
        onClick={handleLeftTap}
      />
      <div
        css={[tapZoneBaseStyle, tapZoneRightStyle]}
        data-testid="tap-zone-right"
        onClick={onNext}
      />
    </div>
  );
}
