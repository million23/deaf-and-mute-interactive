import {
	FiArrowLeft,
	FiArrowLeftCircle,
	FiArrowRightCircle,
	FiArrowUpCircle,
	FiLoader,
} from "react-icons/fi";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import __supabase from "../../../lib/$supabase";
import dayjs from "dayjs";
import { useQuery } from "urql";
import { useRouter } from "next/router";
import { useState } from "react";

const Lesson = () => {
	const router = useRouter();
	const [session, setSession] = useState(null);

	const { slug } = router.query;

	const checkUser = async () => {
		const user = await __supabase.auth.getUser();
		if (user.data) {
			setSession(user.data);
		} else {
			router.push("/");
		}
	};

	const lessonQuery = `
    {
      lessons(where: {lessonSlug: "${slug}"}) {
        id
        lessonTitle
        lessonSlug
        lessonDifficulty
        lessonTags
        lessonContent
				featuredImage {
					url
				}
        createdAt
        module {
          moduleSlug
        }
        nextLesson {
          lessonSlug
          lessonTitle
        }
        prevLesson {
          lessonSlug
          lessonTitle
        }
				videoLesson {
					url
				}
      }
    }
  `;

	const [lessonResult, reexecuteLessonQuery] = useQuery({
		query: lessonQuery,
	});

	const {
		data: lessons,
		fetching: lessonFetching,
		error: lessonError,
	} = lessonResult;

	if (lessonFetching) {
		return (
			<main className="fixed w-full h-screen flex justify-center items-center top-0 left-0">
				<div className="spinner animate-spin">
					<FiLoader className="text-4xl" />
				</div>
			</main>
		);
	}

	const {
		id,
		lessonTitle,
		lessonSlug,
		lessonDifficulty,
		lessonTags,
		lessonContent,
		createdAt,
	} = lessons.lessons[0];

	return (
		<>
			<main className="pt-28">
				<p
					onClick={() => router.back()}
					className="mt-10 text-4xl font-bold flex gap-5 mb-5 cursor-pointer"
				>
					<span>
						<FiArrowLeft />
					</span>
					<span>{lessonTitle}</span>
				</p>

				<p className="flex gap-3">
					{lessonTags.map((tag, index) => (
						<span
							key={`tag_${index + 1}`}
							className="p-2 px-3 text-white bg-pink-500 text-xs rounded-box"
						>
							{tag}
						</span>
					))}
				</p>
				<p className="text-sm mt-5">
					{dayjs(createdAt).format("MMMM D, YYYY")}
				</p>
				<p>
					{(lessonDifficulty === 1 && "Very Easy") ||
						(lessonDifficulty === 2 && "Easy") ||
						(lessonDifficulty === 3 && "Medium") ||
						(lessonDifficulty === 4 && "Hard") ||
						(lessonDifficulty === 5 && "Very Hard")}
				</p>

				{/* featured Image */}
				<div className="mt-10">
					<img
						src={
							lessons.lessons[0].featuredImage?.url ??
							`https://picsum.photos/seed/${id}/500/300`
						}
						className="w-full max-w-2xl object-cover rounded-xl"
						alt={lessonTitle}
					/>
				</div>

				{/* videos */}
				{lessons.lessons[0].videoLesson && (
					<div className="mt-10">
						{lessons.lessons[0].videoLesson?.map((video, index) => (
							<video
								key={`video_${index + 1}`}
								controls={true}
								className="bg-base-300 rounded-lg max-w-2xl"
							>
								<source src={video.url} type="video/mp4" />
							</video>
						))}
					</div>
				)}

				<ReactMarkdown
					className="mt-10 pb-36 flex flex-col gap-5 w-full overflow-hidden"
					components={{
						p: ({ node, ...props }) => <p {...props} />,
						ul: ({ node, ...props }) => (
							<ul className="list-disc flex flex-col gap-2 ml-4" {...props} />
						),
						h1: ({ node, ...props }) => (
							<h1 className="text-3xl font-bold" {...props} />
						),
						h2: ({ node, ...props }) => (
							<h2 className="text-2xl font-bold" {...props} />
						),
						h3: ({ node, ...props }) => (
							<h3 className="text-xl font-bold" {...props} />
						),
						blockquote: ({ node, ...props }) => (
							<blockquote
								className="border-l-4 border-pink-500 pl-4 italic text-lg opacity-80"
								{...props}
							/>
						),
					}}
				>
					{lessonContent}
				</ReactMarkdown>

				<div className="flex flex-col lg:flex-row lg:justify-between mb-16">
					{lessons.lessons[0].prevLesson ? (
						<Link
							href={`
              /tutorials/lesson/${lessons.lessons[0].prevLesson.lessonSlug}
            `}
							className="flex items-center gap-5"
						>
							<FiArrowLeftCircle className="text-2xl" />
							<p className="text-left flex flex-col">
								<span className="text-sm">Previous Lesson</span>
								<span>{lessons.lessons[0].prevLesson.lessonTitle}</span>
							</p>
						</Link>
					) : (
						<div />
					)}
					{lessons.lessons[0].nextLesson ? (
						<Link
							href={`
              /tutorials/lesson/${lessons.lessons[0].nextLesson.lessonSlug}
            `}
							className="flex items-center gap-5"
						>
							<p className="text-right flex flex-col">
								<span className="text-sm">Next Lesson</span>
								<span>{lessons.lessons[0].nextLesson.lessonTitle}</span>
							</p>
							<FiArrowRightCircle className="text-2xl" />
						</Link>
					) : (
						<Link
							href={`
              /tutorials/${lessons.lessons[0].module.moduleSlug}
            `}
							className="flex items-center gap-5"
						>
							<p className="text-right flex flex-col">
								<span>Go to Module Overview</span>
							</p>
							<FiArrowUpCircle className="text-2xl" />
						</Link>
					)}
				</div>
			</main>
		</>
	);
};

export default Lesson;
