import { currentUser } from "@clerk/nextjs/server";

export default async function AuthButton() {
  const user = await currentUser();

  if (user) {
    return (
      <div>
        <button className="btn btn-primary btn-sm btn-outline">Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-primary btn-sm btn-outline">Sign In</button>
    </div>
  );
}
