import { useEffect, useState } from "react";

import { FiLoader } from "react-icons/fi";
import Link from "next/link";
import __supabase from "../../lib/$supabase";
import dayjs from "dayjs";
import { useQuery } from "urql";
import { useRouter } from "next/router";

const modulesQuery = `
  {
    modules {
      id
      createdAt
			featuredImage {
				url
			}
      moduleTitle
      moduleSlug
      moduleDifficulty
      moduleDescription
      lessons {
        id
        lessonSlug
        lessonTitle
        lessonTags
      }
    }
  }
`;

const TutorialPage = () => {
	const [hasUser, setHasUser] = useState(false);
	const router = useRouter();

	const checkUser = async () => {
		const user = await __supabase.auth.getUser();
		if (user.data.user) {
			setHasUser(true);
		}
	};

	useEffect(() => {
		checkUser();
	}, []);

	const [modulesResult, reexecuteModulesQuery] = useQuery({
		query: modulesQuery,
	});

	const {
		data: modules,
		fetching: modulesFetching,
		error: modulesError,
	} = modulesResult;

	if (modulesFetching) {
		return (
			<main className="fixed w-full h-screen flex justify-center items-center top-0 left-0">
				<div className="spinner animate-spin">
					<FiLoader className="text-4xl" />
				</div>
			</main>
		);
	}

	return (
		<>
			<main className="py-28">
				<h1 className="text-2xl font-bold text-center mb-5">
					Check out our Tutorials!
				</h1>

				<ul className="grid grid-cols-2 w-full max-w-3xl mx-auto gap-4">
					{modules.modules.map((module, index) => {
						const {
							moduleTitle,
							moduleSlug,
							moduleDescription,
							moduleDifficulty,
							createdAt,
							id,
							featuredImage,
						} = module;
						return (
							<Link
								key={id}
								href={hasUser ? `/tutorials/${moduleSlug}` : "/login"}
								className="group ring-4 ring-transparent transition-all hover:ring-blue-500 ring-offset-4 hover:ring-offset-8"
							>
								<li
									key={`module-${id}`}
									className="bg-base-300 rounded-box overflow-hidden"
								>
									<div className="relative overflow-hidden">
										<img
											src={featuredImage?.url ?? `https://picsum.photos/seed/${id}/500/300`}
											alt=""
											className="w-full h-[200px] object-cover"
										/>
										<div className="absolute z-10 bottom-0 p-2 px-4 text-sm bg-primary text-primary-content rounded-tr-box">
											{(moduleDifficulty === 1 && <p>Very Easy</p>) ||
												(moduleDifficulty === 2 && <p>Easy</p>) ||
												(moduleDifficulty === 3 && <p>Medium</p>) ||
												(moduleDifficulty === 4 && <p>Hard</p>) ||
												(moduleDifficulty === 5 && <p>Very Hard</p>)}
										</div>
									</div>
									<div className="p-5">
										<p className="font-semibold text-lg">{moduleTitle}</p>
										<p className="text-sm">{moduleDescription}</p>
										<p className="text-xs opacity-50">
											{dayjs(createdAt).format("MMM D YYYY - HH:MM A")}
										</p>
										{!hasUser && (
											<p className="text-xs opacity-50">
												<span className="text-red-500">Login</span> to view this
												tutorial
											</p>
										)}
									</div>
								</li>
							</Link>
						);
					})}
				</ul>
			</main>
		</>
	);
};

export default TutorialPage;
