import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDiscussion } from "@/DiscussionContext";
import FormComment from "./FormComment";
import Comment from "./Comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import parse from "html-react-parser";
import { CommentData } from "../types";
import DropdownDiscussion from "./DropdownDiscussion";

interface ThreadProps {
  id: number;
  user_id: string;
  author: string;
  title: string;
  content: string;
  anonymous: boolean;
  created_at: string;
  comment: {
    id: number;
    user_id: string;
    author: string;
    content: string;
    anonymous: boolean;
    verified: boolean;
    upvote: number;
    created_at: string;
    comment_reply: {
      id: number;
      user_id: string;
      author: string;
      content: string;
      anonymous: boolean;
      verified: boolean;
      created_at: string;
    }[];
  }[];
  thread_tag: {
    tag: {
      id: string;
      nama_tag: string;
    };
  }[];
}

const Discussion = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { discussions, fetchDiscussionList } = useDiscussion();
  const [discussionData, setDiscussionData] = useState<ThreadProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!discussions) {
        await fetchDiscussionList();
      }

      const discussion: ThreadProps | undefined = discussions.find(
        (d: ThreadProps) => d.id === Number(threadId)
      );
      if (discussion) {
        setDiscussionData(discussion);
      }
    };

    fetchData();
  }, [threadId, discussions, fetchDiscussionList]);

  const timeAgo = moment(discussionData?.created_at).fromNow();

  const handleCommentSubmit = async (content: string, anonymous: boolean) => {
    const newComment: CommentData = {
      id: Math.floor(Math.random() * 1000) + 1, // Random ID (replace with actual ID logic)
      user_id: "user1112", // Set user_id accordingly
      author: "John Doe", // Update with author name or leave as Anonymous
      content,
      anonymous,
      verified: false,
      created_at: new Date().toISOString(),
      comment_reply: [], // Initialize with empty array for replies
      thread_id: Number(threadId),
    };

    try {
      const response = await fetch(`http://localhost:3000/discussion/${threadId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("New comment added:", responseData);

        // Update discussionData with the new comment
        setDiscussionData((prevData) => ({
          ...prevData!,
          comment: [...prevData!.comment, responseData],
        }));
      } else {
        console.error("Failed to add comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!discussionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-5 text-left">
      <section className="py-4 px-4 flex justify-between">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="text-base font-semibold text-black">
              {discussionData.anonymous ? "*****" : discussionData.author} •{" "}
              <span className="text-gray-600 font-light">{timeAgo}</span>
            </div>
          </div>
        </div>
        <div>
          <DropdownDiscussion
            showVerify={false}
            user_id={discussionData.user_id}
            path=""
            id={discussionData.id}
          ></DropdownDiscussion>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="font-semibold text-xl mb-3 text-[#1F1D39]">
          {discussionData.title}
        </div>
        <div className="font-light">{parse(discussionData.content)}</div>
      </section>

      <section className="px-4 pb-4">
        <div className="flex justify-between w-full font-medium">
          <div className="pb-2">
            {discussionData.thread_tag.length > 0 ? (
              discussionData.thread_tag.map((tag) => (
                <span
                  key={tag.tag.id}
                  className="text-xs font-medium rounded-md p-1 px-2 mr-2 bg-[#F9A682] text-[#B23E19]"
                >
                  {tag.tag.nama_tag}
                </span>
              ))
            ) : (
              <p>no tags</p>
            )}
          </div>
          <p className="text-right">{discussionData.comment.length} Balasan</p>
        </div>
      </section>
      <hr style={{ border: "1px solid #85878D" }} />

      {/* Form komentar di atas daftar komentar */}
      <section className="px-4 pb-4">
        <FormComment onSubmit={handleCommentSubmit} />
      </section>

      {/* Komentar dan Balasan Komentar */}
      <section className="px-4 pb-4">
        {discussionData.comment.map((comment: any) => (
          <Comment
            key={comment.id}
            id={comment.id}
            user_id={comment.user_id}
            author={comment.author}
            content={comment.content}
            anonymous={comment.anonymous}
            verified={comment.verified}
            upvote={comment.upvote}
            created_at={comment.created_at}
            comment_reply={comment.comment_reply}
          />
        ))}
      </section>
    </div>
  );
};

export default Discussion;
