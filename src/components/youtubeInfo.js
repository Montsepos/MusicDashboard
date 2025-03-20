function YouTubeInfo({ youtubeData }) {
  if (!youtubeData) return <p>No YouTube data available</p>;
  return (
    <div>
      <h3>YouTube Stats</h3>
      <ul>
        {youtubeData.rows.map(([date, views, subs]) => (
          <li key={date}>{date}: {views} views, {subs} subs</li>
        ))}
      </ul>
    </div>
  );
}
export default YouTubeInfo;