import styles from "./TopicTitle.module.css";

interface TopicTitleProps {
  topic: string;
}

const TopicTitle: React.FC<TopicTitleProps> = ({ topic }) => {
  return (
    <div className={styles.titleContainer}>
      <h3>Current Topic:</h3>
      <h1>{topic ?? "No topic found"}</h1>
    </div>
  );
};

export default TopicTitle;
