import { IUser } from "@/models/User";

const userClient = {
  async UpsertUser(user: IUser): Promise<IUser> {
    const result = await fetch(`/api/UpsertUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    console.log("Sending user data");
    const resultJson = await result.json();
    return resultJson.savedUser;
  },
};

export default userClient;
