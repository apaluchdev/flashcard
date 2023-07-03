interface TopicTitleProps {
  topic: string;
}

const TopicTitle: React.FC<TopicTitleProps> = ({ topic }) => {
  return (
    <div>
      <h3 style={{ textAlign: "left" }}>Current Topic:</h3>
      <h1 style={{ fontSize: 64, color: "#802424" }}>{topic}</h1>
    </div>
  );
};

export default TopicTitle;
