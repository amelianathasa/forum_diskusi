import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentReply from "./CommentReply";
import Upvote from "./Upvote";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { useState } from "react";
import DropdownDiscussion from "./DropdownDiscussion";

interface CommentProps {
  id: number;
  user_id: string;
  author: string;
  content: string;
  anonymous: boolean;
  verified: boolean;
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
}

const Comment = ({
  id,
  user_id,
  author,
  content,
  anonymous,
  verified,
  created_at,
  comment_reply,
}: CommentProps) => {
  const [isVerified, setIsVerified] = useState(verified);
  const timeAgo = moment(created_at).fromNow();

  // TODO: move to dropdown component
  return (
    <>
      <section className="py-4 flex justify-between">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="text-base font-semibold text-black">
              {anonymous ? "*****" : author} •{" "}
              <span className="text-gray-600 font-light">{timeAgo}</span>
              {isVerified && (
                <span className="border border-[#38B0AB] text-xs rounded-2xl px-4 py-1 text-[#38B0AB] ml-2">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <div>
          <DropdownDiscussion
            showVerifiy={true}
            user_id={user_id}
            commentId={id}
            setIsVerified={setIsVerified}
            isVerified={isVerified}
            path="/comment"
            id={id}
          ></DropdownDiscussion>
        </div>
      </section>

      <section className="ml-12 px-1 pb-4">
        <div className="font-light">{content}</div>
      </section>

      <section className="ml-12 flex space-x-6 mb-4">
        <div className="flex place-items-center">
          <svg
            width="23"
            height="18"
            viewBox="0 0 23 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.39296 16.0716L0.821533 17.3574L2.46439 13.5002V1.92878C2.46439 1.58778 2.63748 1.26076 2.94557 1.01964C3.25367 0.778525 3.67153 0.643066 4.10725 0.643066H20.5358C20.9715 0.643066 21.3894 0.778525 21.6975 1.01964C22.0055 1.26076 22.1787 1.58778 22.1787 1.92878V14.7859C22.1787 15.1269 22.0055 15.454 21.6975 15.6951C21.3894 15.9361 20.9715 16.0716 20.5358 16.0716H7.39296Z"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.39307 6.42871H17.2502"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.39307 10.2861H13.9645"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="ml-2 font-medium">Balas</p>
        </div>

        <Upvote commentId={id} user_id={getAuthenticatedUser().username} />
      </section>

      <hr />

      <section className="ml-8 pb-4">
        {comment_reply.map((comment) => (
          <CommentReply
            key={comment.id}
            id={comment.id}
            user_id={comment.user_id}
            author={comment.author}
            content={comment.content}
            anonymous={comment.anonymous}
            created_at={comment.created_at}
          ></CommentReply>
        ))}
      </section>
    </>
  );
};

export default Comment;
