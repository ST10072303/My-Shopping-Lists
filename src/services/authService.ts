import axios from "axios";
import bcrypt from "bcryptjs";

import type { User } from "../types";

const API_URL = "http://localhost:3001";

export const registerUser = async (
  user: Omit<User, "id">
): Promise<User> => {
  const existingUsers = await axios.get<User[]>(`${API_URL}/users`,
    {
      params: {
        email: user.email,
      },
    }
  );

  if (existingUsers.data.length > 0) {
    throw new Error("An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = {...user, password: hashedPassword,};
  const response = await axios.post<User>(
    `${API_URL}/users`, newUser);

  return response.data;
};
// login user
export const loginUser = async (email: string, password: string ): Promise<User> => {
  const response = await axios.get<User[]>(
    `${API_URL}/users`, {params: {email},}
  );

  if (response.data.length === 0) {
    throw new Error("Invalid email or password.");
  }

  const user = response.data[0];
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    throw new Error("Invalid email or password.");
  }
  return user;
};
//update profile
export interface UpdateProfileData {
  name: string;
  surname: string;
  cellNumber: string;
}
//update function
export const updateUserProfile = async (userId: string, profileData: UpdateProfileData): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
  return response.json();
};
//update login credencials
export interface UpdateCredentialsData {
  email: string;
  password: string;
}

export const updateUserCredentials = async (userId: string, credentials: UpdateCredentialsData): Promise<User> => {
  
  const existingUsers = await axios.get<User[]>(`${API_URL}/users`,
    {
      params: {email: credentials.email,},
    }
  );
//two accounts should not use same email
  const emailBelongsToAnotherUser =
    existingUsers.data.some((existingUser) => existingUser.id !== userId);

  if (emailBelongsToAnotherUser) {throw new Error("An account with this email already exists.");
  }
  const hashedPassword = await bcrypt.hash(credentials.password,10);
  const response = await axios.patch<User>(`${API_URL}/users/${userId}`,
    {
      email: credentials.email,
      password: hashedPassword,
    }
  );
  return response.data;
};