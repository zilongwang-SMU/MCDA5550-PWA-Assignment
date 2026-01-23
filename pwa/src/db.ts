import Dexie from "dexie";
import type { Table } from "dexie";

export type Task = {
  id?: number;
  text: string;
  date: string;
};

class TaskDB extends Dexie {
  tasks!: Table<Task, number>;

  constructor() {
    super("TaskDatabase");
    this.version(1).stores({
      tasks: "++id, date", // ++id = auto increment
    });
  }
}

export const db = new TaskDB();
