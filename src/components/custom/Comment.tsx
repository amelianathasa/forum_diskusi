import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentReply from "./CommentReply";

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
  const timeAgo = moment(created_at).fromNow();
  return (
    <>
      <section className="py-4">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="text-base font-semibold text-black">
              {anonymous ? "*****" : author} •{" "}
              <span className="text-gray-600 font-light">{timeAgo}</span>
              {verified && (
                <span className="border border-[#38B0AB] text-xs rounded-2xl px-4 py-1 text-[#38B0AB] ml-2">
                  Verified
                </span>
              )}
            </div>
          </div>
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
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.39307 6.42871H17.2502"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.39307 10.2861H13.9645"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="ml-2 font-medium">Balas</p>
        </div>

        <div className="flex place-items-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.8527 16.9487C16.1206 16.9436 16.3821 16.857 16.6088 16.6983C16.8355 16.5396 17.0187 16.315 17.1384 16.0487C17.2736 15.7829 17.3447 15.4827 17.3447 15.1773C17.3447 14.8719 17.2736 14.5717 17.1384 14.3059L10.2599 1.94875C10.1433 1.67989 9.96077 1.45303 9.73333 1.29417C9.50588 1.13546 9.24274 1.05132 8.97414 1.05132C8.70554 1.05132 8.44239 1.13546 8.21495 1.29417C7.98751 1.45303 7.805 1.67989 7.68842 1.94875L0.86128 14.3059C0.726078 14.5717 0.655029 14.8719 0.655029 15.1773C0.655029 15.4827 0.726078 15.7829 0.86128 16.0487C0.981094 16.315 1.16429 16.5396 1.39097 16.6983C1.61764 16.857 1.87913 16.9436 2.147 16.9487L15.8527 16.9487Z"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="ml-2 font-medium">Up Vote</p>
        </div>
      </section>

      <hr />
      
      <section className="ml-4 px-4 pb-4">
        {comment_reply.map((comment) => (
          <CommentReply
            id={comment.id}
            user_id={comment.user_id}
            author={comment.author}
            content={comment.content}
            anonymous={comment.anonymous}
            verified={comment.verified}
            created_at={comment.created_at}
          ></CommentReply>
        ))}
      </section>

    </>
  );
};

export default Comment;
