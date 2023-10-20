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
    const resultJson = await result.json();
    return resultJson.savedUser;
  },

  async GetBookmarks(username: string): Promise<string[]> {
    const result = await fetch(
      `/api/GetBookmarksByUsername?username=${username}`,
    );
    const resultJson = await result.json();
    return resultJson.bookmarks;
  },
};

export default userClient;
