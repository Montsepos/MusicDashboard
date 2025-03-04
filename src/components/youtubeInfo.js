import React from "react";

function YouTubeInfo({ youtubeData }) {
  if (!youtubeData) return null;

  return (
    <div>
      <h3>YouTube Channel: {youtubeData.channelName}</h3>
      <a href={youtubeData.channelUrl} target="_blank" rel="noopener noreferrer">
        <img src={youtubeData.thumbnail} alt="Channel Thumbnail" width="200" />
      </a>
      <table>
        <thead>
          <tr>
            <th>Subscribers</th>
            <th>Total Views</th>
            <th>Videos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{parseInt(youtubeData.subscribers).toLocaleString()}</td>
            <td>{parseInt(youtubeData.totalViews).toLocaleString()}</td>
            <td>{youtubeData.totalVideos}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default YouTubeInfo;