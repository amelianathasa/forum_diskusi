import { createContext, useContext, useEffect, useState } from "react";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { useNavigate } from "react-router-dom";

interface Discussion {
  user_id: string;
  id: number;
  author: string;
  title: string;
  content: string;
  anonymous: boolean;
  comment_count: number;
  created_at: string;
  comment: {
    id: number;
    user_id: string;
    author: string;
    content: string;
    anonymous: boolean;
    verified: boolean;
    created_at: string;
    comment_reply: any[];
  }[];
  thread_tag: {
    tag: {
      id: number;
      nama_tag: string;
    };
  }[];
}

interface Props {
  children: React.ReactNode;
}

const DiscussionContext = createContext<{
  discussions: Discussion[];
  thread: Discussion;
  fetchDiscussionList: () => void;
  fetchThread: (id: number) => void;
  createComment: (body: any, threadId: number) => void;
  deleteComment: (commentId: number) => void;
  createCommentReply: (
    replyContent: string,
    anonymousMode: boolean,
    commentId: number
  ) => void;
  deleteCommentReply: (commentReplyId: number) => void;
  createThread: (formData: any, anonymousMode: boolean) => void;
  deleteThread: (threadId: number) => void;
} | null>(null);

export function DiscussionProvider({ children }: Props) {
  const { authenticatedUser } = getAuthenticatedUser();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [thread, setThread] = useState<Discussion>(null);
  const navigate = useNavigate();

  const fetchDiscussionList = async () => {
    try {
      const response = await fetch("http://localhost:3000/discussion/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  const fetchThread = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/discussion/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setThread(data);
    } catch (error) {
      console.error("Error fetching thread:", error);
    }
  };

  const createThread = async (formData: any, anonymousMode: boolean) => {
    try {
      const response = await fetch("http://localhost:3000/discussion/thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          anonymous: anonymousMode,
          tags: formData.tags, // Mengirim ID tag ke backend
          user_id: formData.user_id,
          author: formData.author,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create thread");
      }

      const data = await response.json();

      setDiscussions((prevData) => [data, ...prevData]);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  const deleteThread = async (threadId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/${threadId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authenticatedUser.username,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setDiscussions((prevData) =>
        prevData.filter((discussion) => discussion.id !== threadId)
      );
      navigate("/");
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  const createComment = async (body: any, threadId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/${threadId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        // Update discussionData with the new comment
        setThread((prevData) => ({
          ...prevData!,
          comment: [responseData, ...prevData!.comment],
        }));
      } else {
        console.error("Failed to add comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authenticatedUser.username,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setThread((prevData) => ({
        ...prevData!,
        comment: prevData!.comment.filter(
          (comment) => comment.id !== commentId
        ),
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const createCommentReply = async (
    replyContent: string,
    anonymousMode: boolean,
    commentId: number
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: authenticatedUser.username,
            author: authenticatedUser.name
              ? authenticatedUser.name
              : authenticatedUser.username,
            content: replyContent, // Mengambil dari replyContent di state
            anonymous: anonymousMode, // Menggunakan nilai anonymousMode
            verified: false,
          }),
        }
      );

      if (response.ok) {
        const newCommentReply = await response.json();
        setThread((prevData) => {
          const updatedComment = prevData.comment.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                comment_reply: [newCommentReply, ...(comment.comment_reply || [])],
              };
            }
            return comment;
          });
          return {
            ...prevData,
            comment: updatedComment,
          };
        });
      } else {
        console.error("Failed to add comment reply:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment reply:", error.message);
    }
  };

  const deleteCommentReply = async (commentReplyId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/discussion/comment-reply/${commentReplyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authenticatedUser.username,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setThread((prevData) => ({
        ...prevData!,
        comment: prevData!.comment.map((comment) => {
          return {
            ...comment,
            comment_reply: comment.comment_reply.filter(
              (reply) => reply.id !== commentReplyId
            ),
          };
        }),
      }));
      fetchDiscussionList();
    } catch (error) {
      console.error("Error deleting comment reply:", error);
    }
  };

  useEffect(() => {
    fetchDiscussionList();
  }, []);

  return (
    <DiscussionContext.Provider
      value={{
        discussions,
        fetchDiscussionList,
        thread,
        fetchThread,
        createComment,
        deleteComment,
        createCommentReply,
        deleteCommentReply,
        createThread,
        deleteThread,
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
}

export const useDiscussion = () => {
  const context = useContext(DiscussionContext);
  if (!context) {
    throw new Error("useDiscussion must be used within a DiscussionProvider");
  }
  return context;
};
