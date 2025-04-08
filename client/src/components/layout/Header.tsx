import React from "react";

interface HeaderProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

const Header: React.FC<HeaderProps> = ({ isPlaying, onPlay, onStop }) => {
  // Handle play/stop button click
  const handlePlayStopClick = () => {
    if (isPlaying) {
      onStop(); // If playing, stop the program
    } else {
      onPlay(); // If stopped, play the program
    }
  };

  return (
    <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.5 2C13.5 2.83 12.83 3.5 12 3.5C11.17 3.5 10.5 2.83 10.5 2H9.5C9.5 3.38 10.62 4.5 12 4.5C13.38 4.5 14.5 3.38 14.5 2H13.5ZM12 5.5C9.47 5.5 7.5 7.47 7.5 10C7.5 12.53 9.47 14.5 12 14.5C14.53 14.5 16.5 12.53 16.5 10C16.5 7.47 14.53 5.5 12 5.5ZM12 13.5C10.02 13.5 8.5 11.98 8.5 10C8.5 8.02 10.02 6.5 12 6.5C13.98 6.5 15.5 8.02 15.5 10C15.5 11.98 13.98 13.5 12 13.5ZM16.09 13.59L15.41 12.91C15.79 12.45 16.11 11.94 16.35 11.38L17.27 11.71C17.01 12.34 16.58 12.95 16.09 13.59ZM16.66 15.66L17.3 16.3C18.54 15.11 19.43 13.56 19.84 11.86L18.89 11.64C18.53 13.12 17.77 14.5 16.66 15.66ZM19.97 20.41C19.97 21.36 20.62 22 21.57 22C22.53 22 23.17 21.36 23.17 20.41C23.17 19.45 22.53 18.81 21.57 18.81C20.62 18.81 19.97 19.45 19.97 20.41ZM4.97 20.41C4.97 21.36 5.62 22 6.57 22C7.53 22 8.17 21.36 8.17 20.41C8.17 19.45 7.53 18.81 6.57 18.81C5.62 18.81 4.97 19.45 4.97 20.41Z"/>
        </svg>
        <h1 className="text-xl font-semibold text-gray-800">Visual Code Editor</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          id="play-btn"
          onClick={handlePlayStopClick}
          className={`${
            isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
          } text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition`}
        >
          {isPlaying ? (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              <span>Stop Program</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Run Program</span>
            </>
          )}
        </button>
        <button
          id="reset-btn"
          onClick={onStop}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
