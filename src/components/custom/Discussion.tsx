import { useEffect } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDiscussion } from "@/DiscussionContext";
import FormComment from "./FormComment";
import Comment from "./Comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import parse from "html-react-parser";
import { CommentData } from "../types";
import DropdownDiscussion from "./DropdownDiscussion";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";

const Discussion = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { fetchThread, thread, createComment} = useDiscussion();
  const { authenticatedUser } = getAuthenticatedUser();

  useEffect(() => {
    fetchThread(Number(threadId));
  }, [threadId]);

  const timeAgo = moment(thread?.created_at).fromNow();

  const handleCommentSubmit = async (content: string, anonymous: boolean) => {
    const newComment: CommentData = {
      user_id: authenticatedUser.username,
      author: authenticatedUser.name ? authenticatedUser.name : authenticatedUser.username,
      content,
      anonymous,
      verified: false,
      created_at: new Date().toISOString(),
      thread_id: Number(threadId),
    };

    createComment(newComment, Number(threadId));
  };

  if (!thread) {
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
              {thread.anonymous ? "*****" : thread.author} •{" "}
              <span className="text-gray-600 font-light">{timeAgo}</span>
            </div>
          </div>
        </div>
        <div>
          <DropdownDiscussion
            showVerify={false}
            user_id={thread.user_id}
            path=""
            id={thread.id}
          ></DropdownDiscussion>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="font-semibold text-xl mb-3 text-[#1F1D39]">
          {thread.title}
        </div>
        <div className="font-light">{parse(thread.content)}</div>
      </section>

      <section className="px-4 pb-4">
        <div className="flex justify-between w-full font-medium">
          <div className="pb-2">
            {thread.thread_tag.length > 0 ? (
              thread.thread_tag.map((tag) => (
                <span
                  key={tag.tag.id}
                  className="text-xs font-medium rounded-md p-1 px-2 mr-2 bg-[#F9A682] text-[#B23E19]"
                >
                  {tag.tag.name}
                </span>
              ))
            ) : (
              <p>no tags</p>
            )}
          </div>
          <p className="text-right">{thread.comment.length} Balasan</p>
        </div>
      </section>
      <hr style={{ border: "1px solid #85878D" }} />

      {/* Form komentar di atas daftar komentar */}
      <section className="px-4 pb-4">
        <FormComment onSubmit={handleCommentSubmit} />
      </section>

      {/* Komentar dan Balasan Komentar */}
      <section className="px-4 pb-4">
        {thread.comment.map((comment: any) => (
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
