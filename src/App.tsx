/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { StoriesBar } from './features/stories/StoriesBar';
import { StoryViewer } from './features/stories/StoryViewer';
import { Story } from './types/story';

const MOBILE_UA_REGEX = /Android|iPhone|iPad|iPod/i;

const appStyle = css`
  min-height: 100vh;
  background: #000;
`;

const desktopMessageStyle = css`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background: #f5f5f5;
  color: #333;
  font-size: 16px;
`;

const detectIsMobile = () => MOBILE_UA_REGEX.test(navigator.userAgent);

function App() {
  const [isMobile] = useState(detectIsMobile);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isMobile) return;

    const loadStories = async () => {
      try {
        const res = await fetch('/stories.json');
        const data = await res.json();
        setStories(data);
      } catch (err) {
        console.error('Failed to load stories', err);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [isMobile]);

  const handleNext = () => {
    setActiveIndex((i) => {
      if (i !== null && i < stories.length - 1) {
        return i + 1;
      } else {
        return null;
      }
    });
  };

  const handlePrev = () => {
    setActiveIndex((i) => {
      if (i !== null && i > 0) {
        return i - 1;
      } else {
        return i;
      }
    });
  };

  const handleClose = () => {
    setActiveIndex(null);
  };

  if (!isMobile) {
    return (
      <div css={desktopMessageStyle}>
        <p>Please open this page on a mobile device to view stories.</p>
      </div>
    );
  }

  return (
    <div css={appStyle}>
      <StoriesBar stories={stories} loading={loading} onSelect={setActiveIndex} />
      {activeIndex !== null && (
        <StoryViewer
          stories={stories}
          activeIndex={activeIndex}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default App;
