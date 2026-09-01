import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors } from "../theme/colors";
import { RootStackParamList } from "../navigation/AppNavigator";
import { TaskData, TaskStatus, TaskPriority, TaskType } from "../types/task";
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "../services/taskService";

type TasksNavigationProp = NativeStackNavigationProp<RootStackParamList, "Tasks">;

const TASK_TYPES: { label: string; value: TaskType }[] = [
  { label: "Task", value: "task" },
  { label: "Deadline", value: "deadline" },
  { label: "Reminder", value: "reminder" },
];

const STATUSES: { label: string; value: TaskStatus }[] = [
  { label: "Not Started", value: "not_started" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Archived", value: "archived" },
];

const PRIORITIES: { label: string; value: TaskPriority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function TasksScreen() {
  const navigation = useNavigation<TasksNavigationProp>();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TaskType>("task");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueAt, setDueAt] = useState("");
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const savedTasks = await getTasks();
      setTasks(savedTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  }

  async function handleSave() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      if (editingTask) {
        const updated: Partial<TaskData> = {
          title: trimmedTitle,
          description: description.trim(),
          type,
          priority,
          updatedAt: new Date().toISOString(),
        };

        if (dueAt.trim()) {
          updated.dueAt = new Date(dueAt.trim()).toISOString();
        }

        const saved = await updateTask(editingTask.id, updated);

        setTasks((prev) =>
          prev.map((t) => (t.id === saved.id ? saved : t))
        );

        setEditingTask(null);
      } else {
        const now = new Date().toISOString();

        const newTask: Partial<TaskData> = {
          title: trimmedTitle,
          description: description.trim(),
          type,
          priority,
          status: "not_started",
          source: "manual",
          createdAt: now,
          updatedAt: now,
        };

        if (dueAt.trim()) {
          newTask.dueAt = new Date(dueAt.trim()).toISOString();
        }

        const saved = await createTask(newTask);

        setTasks((prev) => [saved as TaskData, ...prev]);
      }

      setTitle("");
      setDescription("");
      setDueAt("");
      setType("task");
      setPriority("medium");
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  }

  async function handleComplete(id: string) {
    try {
      const updated = await completeTask(id);

      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTask(id);

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  function startEdit(task: TaskData) {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setType(task.type);
    setPriority(task.priority);
    setDueAt(task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 16) : "");
  }

  function cancelEdit() {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setDueAt("");
    setType("task");
    setPriority("medium");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <View style={styles.form}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Details (optional)"
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.chipRow}>
              {TASK_TYPES.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.chip, type === opt.value && styles.chipActive]}
                  onPress={() => setType(opt.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      type === opt.value && styles.chipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.chipRow}>
              {PRIORITIES.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.chip, priority === opt.value && styles.chipActive]}
                  onPress={() => setPriority(opt.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      priority === opt.value && styles.chipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <TextInput
          value={dueAt}
          onChangeText={setDueAt}
          placeholder="Due at (YYYY-MM-DDTHH:MM)"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>{editingTask ? "Update" : "Create"}</Text>
        </Pressable>

        {editingTask && (
          <Pressable style={styles.cancelButton} onPress={cancelEdit}>
            <Text style={styles.cancelText}>Cancel Edit</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.list}>
        {tasks.map((task) => (
          <Pressable
            key={task.id}
            style={styles.taskCard}
            onLongPress={() => {
              Alert.alert(task.title, "What do you want to do?", [
                {
                  text: "Edit",
                  onPress: () => startEdit(task),
                },
                {
                  text: "Complete",
                  onPress: () => handleComplete(task.id),
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    Alert.alert(
                      "Delete task?",
                      `Delete "${task.title}"?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => handleDelete(task.id),
                        },
                      ]
                    );
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ]);
            }}
          >
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={[styles.badge, styles[`badge_${task.status}`]]}>
                <Text style={styles.badgeText}>{task.status.replace("_", " ")}</Text>
              </View>
            </View>

            {task.description ? (
              <Text style={styles.taskDescription}>{task.description}</Text>
            ) : null}

            <View style={styles.taskMeta}>
              <Text style={styles.taskMetaText}>
                {task.type} · {task.priority} priority
              </Text>
              {task.dueAt ? (
                <Text style={styles.taskMetaText}>
                  Due: {new Date(task.dueAt).toLocaleString()}
                </Text>
              ) : null}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDeep,
    paddingTop: 70,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.spaceMid,
    color: colors.textPrimary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  pickerContainer: {
    flex: 1,
  },
  label: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.spaceMid,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  chipActive: {
    backgroundColor: colors.accentPurple,
    borderColor: colors.accentPurple,
  },
  chipText: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: colors.accentPurple,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelText: {
    color: colors.textTertiary,
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: colors.spaceMid,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  taskTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badge_not_started: {
    backgroundColor: "#334155",
  },
  badge_in_progress: {
    backgroundColor: "#1E40AF",
  },
  badge_completed: {
    backgroundColor: "#065F46",
  },
  badge_archived: {
    backgroundColor: "#4B5563",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  taskDescription: {
    color: colors.textTertiary,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskMetaText: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: "500",
  },
});
