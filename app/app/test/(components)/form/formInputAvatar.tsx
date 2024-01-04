import Image from "next/image";

interface Props {
  image: string;
};

const FormInputAvatar = ({ image }: Props) => {
  <div className="col-span-full flex items-center gap-x-8">
    <Image
      src={image}
      alt="Avatar"
      className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
    />
    <div>
      <button
        type="button"
        className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
      >
        Change avatar
      </button>
      <p className="mt-2 text-xs leading-5 text-gray-400">JPG, GIF or PNG. 1MB max.</p>
    </div>
  </div>
}

export default FormInputAvatar;