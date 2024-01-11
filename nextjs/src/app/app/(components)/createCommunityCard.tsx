"use client"

interface Props {
  setIsOpen: (isOpen: boolean) => void;
}
export default function CreateCommunityCard({ setIsOpen }: Props) {

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-primary-400 hover:text-primary-500 focus:text-primary-500 dark:text-primary-dark-400 dark:hover:text-primary-dark-300 dark:focus:text-primary-dark-300 relative block w-full rounded-lg border-2 border-dashed border-primary-300 dark:border-primary-dark-600 p-12 text-center hover:border-primary-400 dark:hover:border-primary-dark-500 focus:outline-none focus:border-primary-400 dark:focus:border-primary-dark-500 focus:ring-0"
      >
        <svg
          className="mx-auto h-12 w-12 "
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
          />
        </svg>
        <span className="mt-2 block text-sm font-semibold">Create a new community</span>
      </button>
    </>
  );
}
