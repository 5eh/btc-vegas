import { getAllOrganizations } from "@/db/queries";

async function Page() {
  const organizations = await getAllOrganizations();
  
  return (
    <div>
      <pre>{JSON.stringify(organizations, null, 2)}</pre>
    </div>
  );
}

export default Page;