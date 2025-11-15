import { ApiService } from "./api.service";
import { UserType } from "@/types";

interface UpdateUserData {
  username?: string;
  email?: string;
}

class UserServiceClass extends ApiService {
  async getCurrentUser(): Promise<UserType> {
    const response = await this.get<UserType>("/user");
    return response.data;
  }

  async updateUser(data: UpdateUserData): Promise<UserType> {
    const response = await this.put<UserType>("/user", data);
    return response.data;
  }
}

export const UserService = new UserServiceClass();
