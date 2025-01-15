import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../components/firebaseConfig.js";
import NavBar from "../../components/navBar.jsx";
import { Form, Input, DatePicker, Select, Button, List, Typography } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Fetch tasks for the current user
    useEffect(() => {

        console.log("AUTH: ", auth);
        console.log("CURRENT USER: ", currentUser);
        if (!currentUser) return;

        const unsubscribe = onSnapshot(
            collection(db, `Tasks/${currentUser.uid}/UserTasks`),
            (snapshot) => {
                const userTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTasks(userTasks);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    // Handle form submission
    const handleFormSubmit = async (values) => {
        console.log("Current User", currentUser);
        if (!currentUser) {
            console.error("User not authenticated.");
            return;
        }

        try {
            await addDoc(collection(db, `Tasks/${currentUser.uid}/UserTasks`), {
                title: values.title,
                description: values.description,
                dueDate: values.dueDate.toISOString(),
                assignedTo: values.assignedTo,
                createdAt: serverTimestamp(),
                status: "Pending",
            });
            console.log("Task added successfully!");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div className="p-6">
            <NavBar />

            <h1 className="text-3xl font-bold mb-6">Tasks</h1>

            <Form layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item name="title" label="Task Title" rules={[{ required: true, message: "Please enter a task title!" }]}>
                    <Input placeholder="Enter task title" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <TextArea rows={4} placeholder="Enter task description" />
                </Form.Item>

                <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: "Please select a due date!" }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="assignedTo" label="Assign To">
                    <Select placeholder="Select a user or meeting">
                        <Option value="User1">User 1</Option>
                        <Option value="User2">User 2</Option>
                    </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit">Create Task</Button>
            </Form>

            <h2 className="text-2xl font-bold mt-8 mb-4">Your Tasks</h2>
            <List
                bordered
                dataSource={tasks}
                renderItem={(task) => (
                    <List.Item>
                        <Typography.Text strong>{task.title}</Typography.Text> - {task.description}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Tasks;
