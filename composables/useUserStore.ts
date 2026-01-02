import { defineStore } from "pinia";
import { User } from "~/types/types";

export const useUserStore = defineStore("userInfo", {
  state: () => {
    return {
      username: "",
      loggedIn: false,
      department: "NONE",
      id: 0,
      level: -1,
      faculty: false,
      student: {
        is_pg: false,
      },
    } as User & { loggedIn: boolean, department: string, student: { is_pg: boolean } };
  },
  actions: {
    signOut() {
      // Clear all user data from store
      this.loggedIn = false;
      this.username = "";
      this.department = "NONE";
      this.id = 0;
      this.level = -1;
      this.faculty = false;
      this.student = { is_pg: false };
    },
  },
});
