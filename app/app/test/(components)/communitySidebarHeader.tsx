interface Props {
  id: string;
  name: string;
};

const communitySidebarHeader = ({ id, name }: Props) => {

  return (
    <>
      {id}
      {name}
    </>
  )
};

export default communitySidebarHeader;