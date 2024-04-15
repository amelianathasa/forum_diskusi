import { useDiscussion } from "@/DiscussionContext";
import React, { useEffect, useState } from "react";

interface UpvoteProps {
  commentId: number;
  user_id: string;
  upvote: number;
}

const Upvote = ({ commentId, user_id, upvote}: UpvoteProps) => {
  const [upvoted, setUpvoted] = useState(false);
  const { discussions, fetchDiscussionList } = useDiscussion();
  const [upvoteCount, setUpvoteCount] = useState(0);
  const handleUpvote = async () => {
    vote();
  };

  const vote = async () => {
    const response = await fetch(
      `http://localhost:3000/discussion/comment/${commentId}/upvote`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user_id }),
      }
    );
    const data = await response.json();
    // TODO: change implementation to update the upvote count
    fetchDiscussionList();
    setUpvoted(data.voted);
  };

  useEffect(() => {
    const fetchUpvote = async () => {
      const response = await fetch(
        `http://localhost:3000/discussion/comment/user-upvote/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user_id }),
        }
      );
      const data = await response.json();
      if (data.existed) {
        setUpvoted(true);
      }
    }
    fetchUpvote();
  }, [commentId]);

  return (
    <button onClick={handleUpvote}>
      <div className="flex place-items-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill={upvoted ? "#000000" : "none"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.8527 16.9487C16.1206 16.9436 16.3821 16.857 16.6088 16.6983C16.8355 16.5396 17.0187 16.315 17.1384 16.0487C17.2736 15.7829 17.3447 15.4827 17.3447 15.1773C17.3447 14.8719 17.2736 14.5717 17.1384 14.3059L10.2599 1.94875C10.1433 1.67989 9.96077 1.45303 9.73333 1.29417C9.50588 1.13546 9.24274 1.05132 8.97414 1.05132C8.70554 1.05132 8.44239 1.13546 8.21495 1.29417C7.98751 1.45303 7.805 1.67989 7.68842 1.94875L0.86128 14.3059C0.726078 14.5717 0.655029 14.8719 0.655029 15.1773C0.655029 15.4827 0.726078 15.7829 0.86128 16.0487C0.981094 16.315 1.16429 16.5396 1.39097 16.6983C1.61764 16.857 1.87913 16.9436 2.147 16.9487L15.8527 16.9487Z"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="ml-2 font-medium">{upvote}{upvoted ? " Up Voted" : " Up Vote"}</p>
      </div>
    </button>
  );
};

export default Upvote;
