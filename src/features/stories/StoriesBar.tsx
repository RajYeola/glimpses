/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { Story } from '../../types/story';

interface StoriesBarProps {
  stories: Story[];
  loading: boolean;
  onSelect: (index: number) => void;
}

const SKELETON_COUNT = 6;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const barStyle = css`
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const itemStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  width: 68px;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

const avatarStyle = css`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  box-sizing: border-box;
  border: 2.5px solid #e1306c;
  padding: 2px;
  background-clip: content-box;
`;

const avatarSkeletonStyle = css`
  background: #2a2a2a;
  border-color: #333;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const usernameStyle = css`
  font-size: 12px;
  max-width: 68px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const usernameSkeletonStyle = css`
  width: 40px;
  height: 10px;
  border-radius: 4px;
  background: #2a2a2a;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

export function StoriesBar({ stories, loading, onSelect }: StoriesBarProps) {
  function handleSelect(index: number) {
    return () => onSelect(index);
  }

  if (loading) {
    return (
      <div css={barStyle}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div css={itemStyle} key={i}>
            <div css={[avatarStyle, avatarSkeletonStyle]} />
            <span css={[usernameStyle, usernameSkeletonStyle]} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div css={barStyle}>
      {stories.map((story, index) => (
        <button
          css={itemStyle}
          key={story.id}
          data-testid="story-item"
          onClick={handleSelect(index)}
        >
          <img css={avatarStyle} src={story.avatar} alt={story.username} />
          <span css={usernameStyle}>{story.username}</span>
        </button>
      ))}
    </div>
  );
}
