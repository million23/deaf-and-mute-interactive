import { useEffect, useState } from "react";

import { FiLoader } from "react-icons/fi";
import Link from "next/link";
import __supabase from "../../lib/$supabase";
import { useQuery } from "urql";
import { useRouter } from "next/router";

const ModulePage = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);

  const { slug } = router.query;

  const checkUser = async () => {
    const user = await __supabase.auth.getUser();
    if (!user.data) {
      router.push("/");
    } else {
      setSession(user.data);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const moduleQuery = `
    {
      modules (where: {moduleSlug: "${slug}"}) {
        id
        createdAt
        moduleTitle
        moduleSlug
        moduleDifficulty
        moduleDescription
        lessons {
          id
          lessonSlug
          lessonTitle
          lessonTags
          lessonDifficulty
        }
      }
    }
  `;

  const [moduleData, setModuleData] = useState({});
  const [moduleResult, reexecuteModuleQuery] = useQuery({
    query: moduleQuery,
  });

  const {
    data: module,
    fetching: moduleFetching,
    error: moduleError,
  } = moduleResult;

  if (moduleFetching) {
    return (
      <main className="fixed w-full h-screen flex justify-center items-center top-0 left-0">
        <div className="spinner animate-spin">
          <FiLoader className="text-4xl" />
        </div>
      </main>
    );
  }

  const { moduleTitle, moduleDescription, lessons, lessonDifficulty } =
    module.modules[0];

  return (
    <>
      <main className="py-28 pb-32">
        <h1 className="text-3xl font-bold">{moduleTitle}</h1>
        <p className="opacity-70 mb-10">{moduleDescription}</p>

        <ul className="grid grid-cols-2 gap-4">
          {session &&
            lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="ring-4 ring-transparent ring-offset-2 hover:ring-offset-8 hover:ring-blue-500 transition-all"
              >
                <Link href={`/tutorials/lesson/${lesson.lessonSlug}`}>
                  <div className="p-4 bg-base-300">
                    <h2 className="text-xl font-bold">{lesson.lessonTitle}</h2>
                    <p className="">
                      {(lesson.lessonDifficulty === 1 && "Very Easy") ||
                        (lesson.lessonDifficulty === 2 && "Easy") ||
                        (lesson.lessonDifficulty === 3 && "Medium") ||
                        (lesson.lessonDifficulty === 4 && "Hard") ||
                        (lesson.lessonDifficulty === 5 && "Very Hard")}
                    </p>
                    <p className="flex justify-end flex-wrap gap-2 text-[10px] mt-10">
                      {lesson.lessonTags?.map((tag, index) => (
                        <span
                          key={`tag_${index + 1}`}
                          className="p-1 px-2 bg-pink-500 text-white rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};

export default ModulePage;
